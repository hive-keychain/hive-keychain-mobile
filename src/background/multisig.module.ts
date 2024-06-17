import AsyncStorage from '@react-native-async-storage/async-storage';
import {Socket, io} from 'socket.io-client';
import {
  ConnectDisconnectMessage,
  MultisigAccountConfig,
  MultisigConfig,
  SignerConnectMessage,
  SignerConnectResponse,
  SocketMessageCommand,
} from 'src/interfaces/multisig.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {MultisigConfig as ConfigMultisig} from 'utils/config';

let socket: Socket;
let shouldReconnectSocket: boolean = false;
let connectedPublicKeys: SignerConnectMessage[] = [];
const start = async () => {
  console.log(`Starting multisig`);

  socket = io(ConfigMultisig.baseURL, {
    transports: ['websocket'],
    reconnection: true,
    autoConnect: false,
  });

  const multisigConfig: MultisigConfig = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG),
  );

  if (
    multisigConfig &&
    Object.values(multisigConfig).some(
      (config) =>
        config.isEnabled &&
        (config.active.isEnabled || config.posting.isEnabled),
    )
  ) {
    console.log('Some accounts need connection');
    shouldReconnectSocket = true;
    if (!socket.connected) socket.connect();
    connectSocket(multisigConfig);
  } else {
    console.log('Multisig hasnt been enabled for any account');
  }

  // setupPopupListener();
  // setupRefreshConnections();
};

const checkMultisigCommand = async (
  command: string,
  message: ConnectDisconnectMessage,
) => {
  switch (command) {
    case 'MULTISIG_REFRESH_CONNECTIONS':
      await setupRefreshConnections(message);
      break;
    default:
      break;
  }
};

const setupRefreshConnections = async (message: ConnectDisconnectMessage) => {
  console.log('setupRefreshConnections', {message}); //TODO remove line
  const multisigConfig: MultisigConfig = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG),
  );
  const accountMultisigConfig = multisigConfig[message.account];
  if (message.connect) {
    if (!socket.connected) socket.connect();
    shouldReconnectSocket = true;
    connectToBackend(message.account, accountMultisigConfig);
  } else {
    if (message.publicKey && message.publicKey.length > 0) {
      disconnectFromBackend(message.account, message.publicKey);
    } else {
      disconnectFromBackend(
        message.account,
        accountMultisigConfig.active.publicKey,
      );
      disconnectFromBackend(
        message.account,
        accountMultisigConfig.posting.publicKey,
      );
    }
  }
};

//TODO bellow uncomment & implement
// const setupPopupListener = () => {
//   chrome.runtime.onMessage.addListener(
//     async (
//       backgroundMessage: BackgroundMessage,
//       sender: chrome.runtime.MessageSender,
//       sendResp: (response?: any) => void,
//     ) => {
//       if (
//         backgroundMessage.command ===
//         BackgroundCommand.MULTISIG_REQUEST_SIGNATURES
//       ) {
//         const data = backgroundMessage.value as MultisigRequestSignatures;
//         requestSignatures(data, true);
//       }
//     },
//   );
// };

// const requestSignatures = async (
//   data: MultisigRequestSignatures,
//   useRuntimeMessages?: boolean,
// ) => {
//   return new Promise(async (resolve, reject) => {
//     const message = await getRequestSignatureMessage(data);
//     try {
//       socket.volatile.emit(
//         SocketMessageCommand.REQUEST_SIGNATURE,
//         message,
//         withTimeout(
//           async (message: string) => {
//             console.log(message);
//             if (useRuntimeMessages) {
//               chrome.runtime.sendMessage({
//                 command: BackgroundCommand.MULTISIG_REQUEST_SIGNATURES_RESPONSE,
//                 value: {
//                   message: 'multisig_transaction_sent_to_signers',
//                 },
//               });
//             } else {
//               // resolve('multisig_transaction_sent_to_signers');
//               // in this case try to wait for broadcast notification
//               const txId = await waitForBroadcastToBeDone();
//               resolve(txId);
//             }
//           },
//           () => {
//             console.log('timeout in socketio');
//           },
//         ),
//       );
//     } catch (err) {
//       console.log({err});
//     }
//   });
// };

const initAccountsConnections = async (multisigConfig: MultisigConfig) => {
  for (const accountName of Object.keys(multisigConfig)) {
    const multisigAccountConfig = multisigConfig[accountName];
    if (multisigAccountConfig && multisigAccountConfig.isEnabled) {
      connectToBackend(accountName, multisigAccountConfig);
    }
  }
};

const connectSocket = (multisigConfig: MultisigConfig) => {
  socket.on('connect', () => {
    keepAlive();
    initAccountsConnections(multisigConfig);
  });
  socket.on('error', (err: any) => {
    console.log('Error in socket', err);
  });
  socket.on('disconnect', (ev: any) => {
    console.log('Disconnected from socket');
  });

  //TODO bellow uncomment & fix
  // socket.on(
  //   SocketMessageCommand.REQUEST_SIGN_TRANSACTION,
  //   async (signatureRequest: SignatureRequest) => {
  //     const signer = signatureRequest.signers.find((signer: Signer) => {
  //       return signer.publicKey === signatureRequest.targetedPublicKey;
  //     });

  //     if (!signer) {
  //       return;
  //     }

  //     const signedTransaction = await MultisigModule.processSignatureRequest(
  //       signatureRequest,
  //       signer,
  //     );

  //     chrome.runtime.sendMessage({
  //       command: MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP,
  //       value: {
  //         multisigStep: MultisigStep.SIGN_TRANSACTION_FEEDBACK,
  //         data: {
  //           message: 'multisig_dialog_transaction_signed_successfully',
  //           success: true,
  //           signer: signer,
  //         } as MultisigDisplayMessageData,
  //       },
  //     } as MultisigDialogMessage);

  //     if (signedTransaction) {
  //       socket.emit(
  //         SocketMessageCommand.SIGN_TRANSACTION,
  //         {
  //           signature: signedTransaction.signatures[0],
  //           signerId: signer.id,
  //           signatureRequestId: signatureRequest.id,
  //         } as SignTransactionMessage,
  //         async (signatures: string[]) => {
  //           console.log(
  //             `Should try to broadcast ${JSON.stringify(signedTransaction)}`,
  //           );
  //           const txResult = await HiveTxUtils.broadcastAndConfirmTransactionWithSignature(
  //             {
  //               expiration: signedTransaction.expiration,
  //               extensions: signedTransaction.extensions,
  //               operations: signedTransaction.operations,
  //               ref_block_num: signedTransaction.ref_block_num,
  //               ref_block_prefix: signedTransaction.ref_block_prefix,
  //             },
  //             signatures,
  //             true,
  //           );
  //           if (txResult?.confirmed) {
  //             socket.emit(
  //               SocketMessageCommand.NOTIFY_TRANSACTION_BROADCASTED,
  //               {
  //                 signatureRequestId: signatureRequest.id,
  //                 txId: txResult.tx_id,
  //               } as NotifyTxBroadcastedMessage,
  //               () => {
  //                 console.log(`Notified`);
  //               },
  //             );
  //           }
  //         },
  //       );
  //     } else {
  //       //TODO  check if need to return if no rejected
  //     }
  //   },
  // );

  //TODO bellow uncomment & fix
  // socket.on(
  //   SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
  //   async (signatureRequest: SignatureRequest, txId: string) => {
  //     Logger.log(`signature request ${signatureRequest.id} was broadcasted`);
  //     const transaction = await HiveTxUtils.getTransaction(txId);
  //     delete transaction.signatures;
  //     openWindow({
  //       multisigStep: MultisigStep.NOTIFY_TRANSACTION_BROADCASTED,
  //       data: {
  //         message: 'multisig_dialog_transaction_broadcasted',
  //         success: true,
  //         txId: txId,
  //         transaction: transaction,
  //       } as MultisigDisplayMessageData,
  //     });
  //   },
  // );

  if (socket) {
    socket.connect();
  }
};

const disconnectFromBackend = async (
  accountName: string,
  publicKey: string,
) => {
  console.log(
    `Trying to disconnect @${accountName} (${publicKey}) from backend`,
  );
  connectedPublicKeys = connectedPublicKeys.filter(
    (pk) => pk.username === accountName && pk.publicKey === publicKey,
  );
  socket.emit(SocketMessageCommand.SIGNER_DISCONNECT, publicKey);
};

const connectToBackend = async (
  accountName: string,
  accountConfig: MultisigAccountConfig,
) => {
  console.log(`Connecting @${accountName} to the multisig backend server`);
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
      //TODO: Add signing after the fact
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
    },
  );
};

const keepAlive = () => {
  const keepAliveIntervalId = setInterval(() => {
    if (socket) {
      socket.emit('ping');
    } else {
      clearInterval(keepAliveIntervalId);
    }
  }, 20 * 1000);
};

// const getRequestSignatureMessage = async (
//   data: MultisigRequestSignatures,
// ): Promise<RequestSignatureMessage> => {
//   return new Promise(async (resolve, reject) => {
//     const potentialSigners = await MultisigUtils.getPotentialSigners(
//       data.transactionAccount,
//       data.key,
//       data.method,
//     );

//     const signers: RequestSignatureSigner[] = [];
//     for (const [receiverPubKey, weight] of potentialSigners) {
//       signers.push({
//         encryptedTransaction: await encodeTransaction(
//           data.transaction,
//           data.key!.toString(),
//           receiverPubKey,
//         ),
//         publicKey: receiverPubKey,
//         weight: weight.toString(),
//       });
//     }

//     const publicKey = KeysUtils.getPublicKeyFromPrivateKeyString(
//       data.key!.toString(),
//     )!;

//     const keyAuths =
//       data.method === KeychainKeyTypes.active
//         ? data.initiatorAccount.active.key_auths
//         : data.initiatorAccount.posting.key_auths;

//     const keyAuth = keyAuths.find(
//       ([key, weight]) => key.toString() === publicKey.toString(),
//     );

//     const transactionAccountThreshold =
//       data.method === KeychainKeyTypes.active
//         ? data.initiatorAccount.active.weight_threshold
//         : data.initiatorAccount.posting.weight_threshold;

//     const request: RequestSignatureMessage = {
//       initialSigner: {
//         publicKey: publicKey,
//         signature: data.signature,
//         username: data.initiatorAccount.name,
//         weight: keyAuth![1],
//       },
//       signatureRequest: {
//         expirationDate: data.transaction.expiration,
//         keyType: data.method,
//         signers: signers,
//         threshold: transactionAccountThreshold,
//       },
//     };

//     resolve(request);
//   });
// };

// const processSignatureRequest = async (
//   signatureRequest: SignatureRequest,
//   signer: Signer,
// ): Promise<SignedTransaction | undefined> => {
//   if (signer) {
//     const username = connectedPublicKeys.find(
//       (c) => c.publicKey === signer.publicKey,
//     )?.username;

//     let mk = await MkModule.getMk();
//     let openNewWindow = true;
//     if (!mk) {
//       mk = await unlockWallet(signer);
//       openNewWindow = false;
//     }

//     const localAccounts = await BgdAccountsUtils.getAccountsFromLocalStorage(
//       mk,
//     );
//     const localAccount = localAccounts.find((la) => la.name === username);
//     const key = localAccount?.keys[
//       signatureRequest.keyType.toLowerCase() as KeychainKeyTypesLC
//     ]?.toString()!;
//     const decodedTransaction = await decryptRequest(signer, key);
//     if (decodedTransaction) {
//       const signedTransaction = await requestSignTransactionFromUser(
//         decodedTransaction,
//         signer,
//         signatureRequest,
//         key,
//         openNewWindow,
//       );
//       return signedTransaction;
//     } else {
//       return;
//     }
//   }
// };

// const unlockWallet = async (signer: Signer) => {
//   return new Promise((resolve, reject) => {
//     const onReceiveMK = async (
//       backgroundMessage: BackgroundMessage,
//       sender: chrome.runtime.MessageSender,
//       sendResp: (response?: any) => void,
//     ) => {
//       if (
//         backgroundMessage.command === BackgroundCommand.MULTISIG_UNLOCK_WALLET
//       ) {
//         if (backgroundMessage.value) {
//           try {
//             if (await MkUtils.login(backgroundMessage.value)) {
//               resolve(backgroundMessage.value);
//               chrome.runtime.onMessage.removeListener(onReceiveMK);
//             } else {
//               chrome.runtime.sendMessage({
//                 command: MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP,
//                 value: {
//                   multisigStep: MultisigStep.UNLOCK_WALLET,
//                   data: {feedback: 'wrong_password'},
//                 },
//               });
//             }
//           } catch (err) {
//             chrome.runtime.sendMessage({
//               command: MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP,
//               value: {
//                 multisigStep: MultisigStep.UNLOCK_WALLET,
//                 data: {feedback: 'wrong_password'},
//               },
//             });
//           }
//         } else {
//           resolve(undefined);
//         }
//       }
//     };
//     chrome.runtime.onMessage.addListener(onReceiveMK);

//     openWindow({
//       multisigStep: MultisigStep.UNLOCK_WALLET,
//       data: {signer: signer} as MultisigDataType,
//     });
//   });
// };

// const requestSignTransactionFromUser = (
//   decodedTransaction: any,
//   signer: Signer,
//   signatureRequest: SignatureRequest,
//   key: string,
//   openNewWindow?: boolean,
// ): Promise<SignedTransaction | undefined> => {
//   return new Promise(async (resolve, reject) => {
//     const onReceivedMultisigAcceptResponse = async (
//       backgroundMessage: BackgroundMessage,
//       sender: chrome.runtime.MessageSender,
//       sendResp: (response?: any) => void,
//     ) => {
//       if (
//         backgroundMessage.command ===
//           BackgroundCommand.MULTISIG_ACCEPT_RESPONSE &&
//         backgroundMessage.value?.multisigData.data.signer.id === signer.id
//       ) {
//         if (backgroundMessage.value.accepted) {
//           const signedTransaction = await HiveTxUtils.signTransaction(
//             decodedTransaction,
//             key,
//           );
//           resolve(signedTransaction as SignedTransaction);
//           chrome.runtime.onMessage.removeListener(
//             onReceivedMultisigAcceptResponse,
//           );
//         } else {
//           resolve(undefined);
//         }
//       }
//     };
//     chrome.runtime.onMessage.addListener(onReceivedMultisigAcceptResponse);
//     const usernames = await KeysUtils.getKeyReferences([signer.publicKey]);

//     if (openNewWindow) {
//       openWindow({
//         multisigStep: MultisigStep.ACCEPT_REJECT_TRANSACTION,
//         data: {
//           username: usernames[0],
//           signer,
//           signatureRequest,
//           decodedTransaction,
//         } as MultisigAcceptRejectTxData,
//       });
//     } else {
//       chrome.runtime.sendMessage({
//         command: MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP,
//         value: {
//           multisigStep: MultisigStep.ACCEPT_REJECT_TRANSACTION,
//           data: {
//             username: usernames[0],
//             signer,
//             signatureRequest,
//             decodedTransaction,
//           } as MultisigAcceptRejectTxData,
//         },
//       });
//     }
//   });
// };

// const decryptRequest = async (signer: Signer, key: string) => {
//   return await MultisigUtils.decodeTransaction(
//     signer.encryptedTransaction,
//     key,
//   );
// };

// const encodeTransaction = async (
//   transaction: any,
//   key: string,
//   receiverPublicKey: string,
// ): Promise<string> => {
//   return await MultisigUtils.encodeTransaction(
//     transaction,
//     key,
//     receiverPublicKey,
//   );
// };

// const notifyTransactionBroadcasted = (signatureRequest: SignatureRequest) => {};

// const openWindow = (data: MultisigData): void => {
//   chrome.windows.getCurrent(async (currentWindow) => {
//     const win: chrome.windows.CreateData = {
//       url: chrome.runtime.getURL('multisig-dialog.html'),
//       type: 'popup',
//       height: 600,
//       width: 435,
//       left: currentWindow.width! - 350 + currentWindow.left!,
//       top: currentWindow.top!,
//       focused: true,
//     };
//     // Except on Firefox
//     //@ts-ignore
//     if (typeof InstallTrigger === undefined) win.focused = true;
//     chrome.windows.create(win, (window) => {
//       waitUntilDialogIsReady(100, MultisigDialogCommand.READY_MULTISIG, () => {
//         chrome.runtime.sendMessage({
//           command: MultisigDialogCommand.MULTISIG_SEND_DATA_TO_POPUP,
//           value: data,
//         } as MultisigDialogMessage);
//       });
//     });
//   });
// };

// const withTimeout = (
//   onSuccess: any,
//   onTimeout: any,
//   timeout: number = 5000,
// ) => {
//   let called = false;

//   const timer = setTimeout(() => {
//     if (called) return;
//     called = true;
//     onTimeout();
//   }, timeout);

//   return (...args: any) => {
//     if (called) return;
//     called = true;
//     clearTimeout(timer);
//     onSuccess.apply(this, args);
//   };
// };

// const waitForBroadcastToBeDone = async () => {
//   return new Promise((resolve, reject) => {
//     const broadcastedListener = async (
//       signatureRequest: SignatureRequest,
//       txId: string,
//     ) => {
//       socket.off(
//         SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
//         broadcastedListener,
//       );
//       resolve(txId);
//     };
//     socket.on(
//       SocketMessageCommand.TRANSACTION_BROADCASTED_NOTIFICATION,
//       broadcastedListener,
//     );
//   });
// };

setInterval(() => {
  if (shouldReconnectSocket && (!socket || !socket.connected)) {
    console.log('Restarting the socket');
    start();
  }
}, 60 * 1000);

export const MultisigModule = {
  start,
  checkMultisigCommand,
  // processSignatureRequest,
  // requestSignatures,
};
