import { SignedTransaction } from "@hiveio/dhive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showModal } from "actions/message";
import { signBuffer } from "components/bridge";
import RequestMultisig from "components/multisig/RequestMultisig";
import { KeychainKeyTypes, KeychainKeyTypesLC } from "hive-keychain-commons";
import React from "react";
import SimpleToast from "react-native-root-toast";
import { Socket, io } from "socket.io-client";
import { MessageModalType } from "src/enums/messageModal.enums";
import {
  ConnectDisconnectMessage,
  MultisigAccountConfig,
  MultisigConfig,
  MultisigRequestSignatures,
  NotifyTxBroadcastedMessage,
  RequestSignatureMessage,
  RequestSignatureSigner,
  SignTransactionMessage,
  SignatureRequest,
  Signer,
  SignerConnectMessage,
  SignerConnectResponse,
  SocketMessageCommand,
  TransactionOptionsMetadata,
} from "src/interfaces/multisig.interface";
import { KeychainStorageKeyEnum } from "src/reference-data/keychainStorageKeyEnum";
import { RootState, store } from "store";
import { MultisigConfig as MultisigConfiguration } from "utils/config";
import {
  broadcastAndConfirmTransactionWithSignature,
  getTransaction,
  signTx,
} from "utils/hive";
import { KeyUtils } from "utils/key.utils";
import { sleep } from "utils/keychain";
import { getPublicKeyFromPrivateKeyString } from "utils/keyValidation";
import { translate } from "utils/localize";
import { MultisigUtils } from "utils/multisig.utils";
import { goBack, navigate } from "utils/navigation";

let socket: Socket;
let shouldReconnectSocket: boolean = false;
let connectedPublicKeys: SignerConnectMessage[] = [];
const lockedRequests: number[] = [];

const start = async () => {
  console.info(`Starting multisig`);

  socket = io(MultisigConfiguration.baseURL, {
    transports: ["websocket"],
    reconnection: true,
    autoConnect: false,
  });

  const multisigConfig: MultisigConfig = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG)
  );

  if (
    multisigConfig &&
    Object.values(multisigConfig).some(
      (config) =>
        config.isEnabled &&
        (config.active.isEnabled || config.posting.isEnabled)
    )
  ) {
    console.info("Some accounts need connection");
    shouldReconnectSocket = true;
    if (!socket.connected) socket.connect();
    connectSocket(multisigConfig);
  } else {
    console.info("Multisig hasnt been enabled for any account");
  }
};

const refreshConnections = async (value: ConnectDisconnectMessage) => {
  const multisigConfig: MultisigConfig = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG)
  );
  const accountMultisigConfig = multisigConfig[value.account];
  if (value.connect) {
    if (!socket.connected) socket.connect();
    await sleep(1000);
    connectSocket(multisigConfig);
    shouldReconnectSocket = true;
    connectToBackend(value.account, accountMultisigConfig);
  } else {
    if (value.publicKey && value.publicKey.length > 0) {
      disconnectFromBackend(value.account, value.publicKey);
    } else {
      disconnectFromBackend(
        value.account,
        accountMultisigConfig.active.publicKey
      );
      disconnectFromBackend(
        value.account,
        accountMultisigConfig.posting.publicKey
      );
    }
  }
};

export const requestMultisigSignatures = async (
  data: MultisigRequestSignatures
) => {
  await createConnectionIfNeeded(data);
  return requestSignatures(data, data.options.fromWallet ?? true);
};

// When the socket has not been initialized because multisig is not enabled for any account
// this allows to create a connection on the go to wait for a multisig response
const createConnectionIfNeeded = async (data: MultisigRequestSignatures) => {
  if (!socket.connected) {
    shouldReconnectSocket = true;
    socket.connect();
    connectSocket({});
    await sleep(1000);
  }

  const config: MultisigConfig =
    JSON.parse(
      await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG)
    ) || {};
  if (
    !config[data.initiatorAccount.name]?.[
      data.method?.toLowerCase() as "posting" | "active"
    ].isEnabled
  ) {
    const config = {
      isEnabled: true,
      posting:
        data.method.toLowerCase() === "posting"
          ? {
              isEnabled: true,
              publicKey: getPublicKeyFromPrivateKeyString(data.key!)!,
              message: await signBuffer(
                data.key?.toString()!,
                data.initiatorAccount.name!
              ),
            }
          : { isEnabled: false, message: "", publicKey: "" },
      active:
        data.method.toLowerCase() === "active"
          ? {
              isEnabled: true,
              publicKey: getPublicKeyFromPrivateKeyString(data.key!)!,
              message: await signBuffer(
                data.key?.toString()!,
                data.initiatorAccount.name!
              ),
            }
          : { isEnabled: false, message: "", publicKey: "" },
    } as MultisigAccountConfig;
    await connectToBackend(data.initiatorAccount.name, config);

    await sleep(1000);
  }
};

const requestSignatures = async (
  data: MultisigRequestSignatures,
  fromWallet?: boolean
) => {
  return new Promise(async (resolve, reject) => {
    await createConnectionIfNeeded(data);
    const message = await getRequestSignatureMessage(data);
    try {
      console.log("emitting message", message);
      socket.volatile.emit(
        SocketMessageCommand.REQUEST_SIGNATURE,
        message,
        withTimeout(
          async (message: string) => {
            if (fromWallet) {
              SimpleToast.show(message);
              resolve("");
            } else {
              // resolve('multisig_transaction_sent_to_signers');
              // in this case try to wait for broadcast notification
              try {
                const { txId, id } = (await waitForBroadcastToBeDone()) as {
                  txId: string;
                  id: number;
                };
                if (!lockedRequests.includes(id)) {
                  lockedRequests.push(id);
                  resolve(txId);
                }
              } catch (err) {
                console.log("catching error", err);
                resolve({ error: { message: err } });
              }
            }
          },
          () => {
            console.info("timeout in socketio");
          }
        )
      );
    } catch (err) {
      console.error({ err });
    }
  });
};

const initAccountsConnections = async (multisigConfig: MultisigConfig) => {
  for (const accountName of Object.keys(multisigConfig)) {
    const multisigAccountConfig = multisigConfig[accountName];
    if (multisigAccountConfig && multisigAccountConfig.isEnabled) {
      connectToBackend(accountName, multisigAccountConfig);
    }
  }
};

const connectSocket = (multisigConfig: MultisigConfig) => {
  socket.on("connect", () => {
    console.info("Connected to socket");

    keepAlive();
    initAccountsConnections(multisigConfig);
  });
  socket.on("error", (err: any) => {
    console.error("Error in socket", err);
  });
  socket.on("disconnect", (ev: any) => {
    console.info("Disconnected from socket");
    socket.connect();
  });

  socket.on(
    SocketMessageCommand.REQUEST_SIGN_TRANSACTION,
    async (signatureRequest: SignatureRequest) => {
      const signer = signatureRequest.signers.find((signer: Signer) => {
        return signer.publicKey === signatureRequest.targetedPublicKey;
      });

      if (!signer) {
        return;
      }

      const signedTransaction = await MultisigModule.processSignatureRequest(
        signatureRequest,
        signer
      );

      SimpleToast.show(translate("multisig.transaction_signed_successfully"), {
        duration: SimpleToast.durations.LONG,
      });
      if (signedTransaction) {
        socket.emit(
          SocketMessageCommand.SIGN_TRANSACTION,
          {
            signature: signedTransaction.signatures[0],
            signerId: signer.id,
            signatureRequestId: signatureRequest.id,
          } as SignTransactionMessage,
          async (signatures: string[]) => {
            console.info(
              `Should try to broadcast ${JSON.stringify(signedTransaction)}`
            );
            const txResult = await broadcastAndConfirmTransactionWithSignature(
              {
                expiration: signedTransaction.expiration,
                extensions: signedTransaction.extensions,
                operations: signedTransaction.operations,
                ref_block_num: signedTransaction.ref_block_num,
                ref_block_prefix: signedTransaction.ref_block_prefix,
              },
              signatures,
              true
            );
            if (txResult?.confirmed) {
              socket.emit(
                SocketMessageCommand.NOTIFY_TRANSACTION_BROADCASTED,
                {
                  signatureRequestId: signatureRequest.id,
                  txId: txResult.tx_id,
                } as NotifyTxBroadcastedMessage,
                () => {
                  console.info(`Notified`);
                }
              );
            }
          }
        );
      } else {
        //TODO  check if need to return if no rejected
      }
    }
  );

  socket.on(
    SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
    async (signatureRequest: SignatureRequest, txId: string) => {
      const transaction = await getTransaction(txId);
      delete transaction.signatures;
      if (!lockedRequests.includes(signatureRequest.id)) {
        lockedRequests.push(signatureRequest.id);
        openModal(
          "multisig.transaction_broadcasted",
          MessageModalType.MULTISIG_SUCCESS,
          { txId }
        );
      }
    }
  );
  socket.on(SocketMessageCommand.TRANSACTION_ERROR_NOTIFICATION, async (e) => {
    await sleep(200);
    if (!lockedRequests.includes(e.signatureRequest.id)) {
      lockedRequests.push(e.signatureRequest.id);
      openModal(`multisig.${e.error.message}`, MessageModalType.ERROR);
    }
  });

  if (socket) {
    socket.connect();
  }
};

const disconnectFromBackend = async (
  accountName: string,
  publicKey: string
) => {
  console.info(
    `Trying to disconnect @${accountName} (${publicKey}) from backend`
  );
  connectedPublicKeys = connectedPublicKeys.filter(
    (pk) => pk.username === accountName && pk.publicKey === publicKey
  );
  socket.emit(SocketMessageCommand.SIGNER_DISCONNECT, publicKey);
};

const connectToBackend = async (
  accountName: string,
  accountConfig: MultisigAccountConfig
) => {
  console.info(`Connecting @${accountName} to the multisig backend server`);
  const signerConnectMessages: SignerConnectMessage[] = [];
  if (
    accountConfig.active?.isEnabled &&
    !connectedPublicKeys
      .map((cpk) => cpk.publicKey)
      .includes(accountConfig.active?.publicKey?.toString())
  ) {
    signerConnectMessages.push({
      username: accountName,
      publicKey: accountConfig.active.publicKey,
      message: accountConfig.active.message,
    });
  }
  if (
    accountConfig.posting?.isEnabled &&
    !connectedPublicKeys
      .map((cpk) => cpk.publicKey)
      .includes(accountConfig.posting?.publicKey?.toString())
  ) {
    signerConnectMessages.push({
      username: accountName,
      publicKey: accountConfig.posting.publicKey,
      message: accountConfig.posting.message,
    });
  }
  socket.emit(
    SocketMessageCommand.SIGNER_CONNECT,
    signerConnectMessages,
    (signerConnectResponse: SignerConnectResponse) => {
      for (const signer of signerConnectMessages) {
        if (
          !(
            signerConnectResponse.errors &&
            Object.keys(signerConnectResponse.errors).includes(signer.publicKey)
          )
        ) {
          connectedPublicKeys.push(signer);
        }
      }
    }
  );
};

const keepAlive = () => {
  const keepAliveIntervalId = setInterval(() => {
    if (socket) {
      socket.emit("ping");
    } else {
      clearInterval(keepAliveIntervalId);
    }
  }, 10 * 1000);
};

const getRequestSignatureMessage = async (
  data: MultisigRequestSignatures
): Promise<RequestSignatureMessage> => {
  return new Promise(async (resolve, reject) => {
    const potentialSigners = await MultisigUtils.getPotentialSigners(
      data.transactionAccount,
      data.key,
      data.method
    );
    const signers: RequestSignatureSigner[] = [];
    for (const [receiverPubKey, weight] of potentialSigners) {
      const metaData: TransactionOptionsMetadata = data.options.metaData ?? {};
      const usernames = await KeyUtils.getKeyReferences([receiverPubKey]);
      let twoFACodes = {};
      if (data.options?.metaData?.twoFACodes) {
        twoFACodes = {
          [usernames[0]]: await encodeMetadata(
            data.options?.metaData?.twoFACodes[usernames[0]],
            data.key!.toString(),
            receiverPubKey
          ),
        };
      }

      signers.push({
        encryptedTransaction: await encodeTransaction(
          data.transaction,
          data.key!.toString(),
          receiverPubKey
        ),
        publicKey: receiverPubKey,
        weight: weight.toString(),
        metaData: { ...metaData, twoFACodes: twoFACodes },
      });
    }

    const publicKey = getPublicKeyFromPrivateKeyString(data.key!.toString())!;

    const keyAuths =
      data.method === KeychainKeyTypes.active
        ? data.initiatorAccount.active.key_auths
        : data.initiatorAccount.posting.key_auths;

    const keyAuth = keyAuths.find(
      ([key, weight]) => key.toString() === publicKey.toString()
    );

    const transactionAccountThreshold =
      data.method === KeychainKeyTypes.active
        ? data.initiatorAccount.active.weight_threshold
        : data.initiatorAccount.posting.weight_threshold;

    const request: RequestSignatureMessage = {
      initialSigner: {
        publicKey: publicKey,
        signature: data.signature,
        username: data.initiatorAccount.name,
        weight: keyAuth![1],
      },
      signatureRequest: {
        expirationDate: data.transaction.expiration,
        keyType: data.method,
        signers: signers,
        threshold: transactionAccountThreshold,
      },
    };

    resolve(request);
  });
};

const processSignatureRequest = async (
  signatureRequest: SignatureRequest,
  signer: Signer
): Promise<SignedTransaction | undefined> => {
  if (signer) {
    const username = connectedPublicKeys.find(
      (c) => c.publicKey === signer.publicKey
    )?.username;

    const accounts = (store.getState() as RootState).accounts;
    const localAccount = accounts.find((la) => la.name === username);
    const key =
      localAccount?.keys[
        signatureRequest.keyType.toLowerCase() as KeychainKeyTypesLC
      ]?.toString()!;
    const decodedTransaction = await decryptRequest(signer, key);
    if (decodedTransaction) {
      const signedTransaction = await requestSignTransactionFromUser(
        decodedTransaction,
        signer,
        signatureRequest,
        key
      );
      return signedTransaction;
    } else {
      return;
    }
  }
};

const requestSignTransactionFromUser = (
  decodedTransaction: any,
  signer: Signer,
  signatureRequest: SignatureRequest,
  key: string,
  openNewWindow?: boolean
): Promise<SignedTransaction | undefined> => {
  return new Promise(async (resolve, reject) => {
    const usernames = await KeyUtils.getKeyReferences([signer.publicKey]);

    navigate("ModalScreen", {
      name: `Operation_sign_multisig`,
      modalContent: (
        <RequestMultisig
          request={{
            decodedTransaction,
            signer: usernames[0],
            signatureRequest,
            key: signer.publicKey,
          }}
          approve={async () => {
            const signedTransaction = await signTx(key, decodedTransaction);
            resolve(signedTransaction as SignedTransaction);
            goBack();
          }}
        />
      ),
    });
    //TODO: Implement

    //   const onReceivedMultisigAcceptResponse = async (
    //     backgroundMessage: BackgroundMessage,
    //     sender: chrome.runtime.MessageSender,
    //     sendResp: (response?: any) => void,
    //   ) => {
    //     if (
    //       backgroundMessage.command ===
    //         BackgroundCommand.MULTISIG_ACCEPT_RESPONSE &&
    //       backgroundMessage.value?.multisigData.data.signer.id === signer.id
    //     ) {
    //       if (backgroundMessage.value.accepted) {
    //         const signedTransaction = await HiveTxUtils.signTransaction(
    //           decodedTransaction,
    //           key,
    //         );
    //         resolve(signedTransaction as SignedTransaction);
    //         chrome.runtime.onMessage.removeListener(
    //           onReceivedMultisigAcceptResponse,
    //         );
    //       } else {
    //         resolve(undefined);
    //       }
    //     }
    //   };
    //   chrome.runtime.onMessage.addListener(onReceivedMultisigAcceptResponse);
    //   const usernames = await KeysUtils.getKeyReferences([signer.publicKey]);
    //   if (openNewWindow) {
    //     openWindow({
    //       multisigStep: MultisigStep.ACCEPT_REJECT_TRANSACTION,
    //       data: {
    //         username: usernames[0],
    //         signer,
    //         signatureRequest,
    //         decodedTransaction,
    //       } as MultisigAcceptRejectTxData,
    //     });
    //   } else {
    //     //TODO: Complete here
    //     console.log({
    //       command: 'MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP',
    //       value: {
    //         multisigStep: MultisigStep.ACCEPT_REJECT_TRANSACTION,
    //         data: {
    //           username: usernames[0],
    //           signer,
    //           signatureRequest,
    //           decodedTransaction,
    //         } as MultisigAcceptRejectTxData,
    //       },
    //     });
    //   }
  });
};

const decryptRequest = async (signer: Signer, key: string) => {
  return await MultisigUtils.decodeTransaction(
    signer.encryptedTransaction,
    key
  );
};

const encodeTransaction = async (
  transaction: any,
  key: string,
  receiverPublicKey: string
): Promise<string> => {
  return await MultisigUtils.encodeTransaction(
    transaction,
    key,
    receiverPublicKey
  );
};

const encodeMetadata = async (
  metaData: any,
  key: string,
  receiverPublicKey: string
): Promise<string> => {
  return await MultisigUtils.encodeMetadata(metaData, key, receiverPublicKey);
};

const withTimeout = (
  onSuccess: any,
  onTimeout: any,
  timeout: number = 5000
) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args: any) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess.apply(this, args);
  };
};

const waitForBroadcastToBeDone = async () => {
  return new Promise((resolve, reject) => {
    const broadcastedListener = async (
      signatureRequest: SignatureRequest,
      txId: string
    ) => {
      socket.off(
        SocketMessageCommand.TRANSACTION_ERROR_NOTIFICATION,
        notifyError
      );
      socket.off(
        SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
        broadcastedListener
      );
      resolve({ txId, id: signatureRequest.id });
    };

    const notifyError = async (res: any) => {
      socket.off(
        SocketMessageCommand.TRANSACTION_ERROR_NOTIFICATION,
        notifyError
      );
      socket.off(
        SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
        broadcastedListener
      );
      if (!lockedRequests.includes(res.signatureRequest.id)) {
        lockedRequests.push(res.signatureRequest.id);
        reject(res.error.message);
      }
    };
    socket.on(
      SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
      broadcastedListener
    );
    socket.on(SocketMessageCommand.TRANSACTION_ERROR_NOTIFICATION, notifyError);
  });
};

setInterval(() => {
  if (shouldReconnectSocket && (!socket || !socket.connected)) {
    console.log("Restarting the socket");
    start();
  }
}, 60 * 1000);

const openModal = (
  key: string,
  type: MessageModalType,
  params?: any,
  skipTranslation?: boolean
) => {
  store.dispatch(showModal(key, type, params, skipTranslation));
};

export const MultisigModule = {
  start,
  processSignatureRequest,
  requestSignatures,
  encodeMetadata,
  refreshConnections,
};
