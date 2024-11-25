import {
  AccountCreateOperation,
  AccountCreateWithDelegationOperation,
  AccountUpdate2Operation,
  AccountUpdateOperation,
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  CancelTransferFromSavingsOperation,
  ChangeRecoveryAccountOperation,
  ClaimAccountOperation,
  ClaimRewardBalanceOperation,
  CollateralizedConvertOperation,
  CommentOperation,
  CommentOptionsOperation,
  ConvertOperation,
  CreateClaimedAccountOperation,
  CreateProposalOperation,
  CustomBinaryOperation,
  CustomJsonOperation,
  CustomOperation,
  DeclineVotingRightsOperation,
  DelegateVestingSharesOperation,
  DeleteCommentOperation,
  EscrowApproveOperation,
  EscrowDisputeOperation,
  EscrowReleaseOperation,
  EscrowTransferOperation,
  ExtendedAccount,
  FeedPublishOperation,
  LimitOrderCancelOperation,
  LimitOrderCreate2Operation,
  LimitOrderCreateOperation,
  PowOperation,
  RecoverAccountOperation,
  RecurrentTransferOperation,
  RemoveProposalOperation,
  ReportOverProductionOperation,
  RequestAccountRecoveryOperation,
  ResetAccountOperation,
  SetResetAccountOperation,
  SetWithdrawVestingRouteOperation,
  SignedTransaction,
  Transaction,
  TransferFromSavingsOperation,
  TransferOperation,
  TransferToSavingsOperation,
  TransferToVestingOperation,
  UpdateProposalOperation,
  UpdateProposalVotesOperation,
  VoteOperation,
  WithdrawVestingOperation,
  WitnessSetPropertiesOperation,
  WitnessUpdateOperation,
} from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import {decodeMemo, encodeMemo} from 'components/bridge';
import {KeychainKeyTypes, KeychainKeyTypesLC} from 'hive-keychain-commons';
import {Key} from 'react';
import {KeyType} from 'src/interfaces/keys.interface';
import {MultisigAccountConfig} from 'src/interfaces/multisig.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getClient} from './hive';
import {KeyUtils} from './key.utils';
import {getPublicKeyFromPrivateKeyString} from './keyValidation';

const getMultisigAccountConfig = async (account: string) => {
  const multisigConfig = await AsyncStorage.getItem(
    KeychainStorageKeyEnum.MULTISIG_CONFIG,
  );
  if (!multisigConfig) return null;
  return JSON.parse(multisigConfig)[account];
};

const saveMultisigConfig = async (
  account: string,
  newAccountConfig: MultisigAccountConfig,
) => {
  let config = JSON.parse(
    await AsyncStorage.getItem(KeychainStorageKeyEnum.MULTISIG_CONFIG),
  );
  if (!config) config = {};
  config[account] = newAccountConfig;
  await AsyncStorage.setItem(
    KeychainStorageKeyEnum.MULTISIG_CONFIG,
    JSON.stringify(config),
  );
};

const getUsernameFromTransaction = (tx: Transaction) => {
  let username;
  if (!tx.operations || !tx.operations.length) return;
  for (const op of tx.operations) {
    if (!op[0] || !op[1] || typeof op[1] !== 'object') return;
    let newUsername;
    switch (op[0]) {
      case 'account_create':
        newUsername = (op as AccountCreateOperation)[1].creator;
        break;
      case 'account_create_with_delegation':
        newUsername = (op as AccountCreateWithDelegationOperation)[1].creator;
        break;
      case 'account_update':
        newUsername = (op as AccountUpdateOperation)[1].account;
        break;
      case 'account_update2':
        newUsername = (op as AccountUpdate2Operation)[1].account;
        break;
      case 'account_witness_proxy':
        newUsername = (op as AccountWitnessProxyOperation)[1].account;
        break;
      case 'account_witness_vote':
        newUsername = (op as AccountWitnessVoteOperation)[1].account;
        break;
      case 'cancel_transfer_from_savings':
        newUsername = (op as CancelTransferFromSavingsOperation)[1].from;
        break;
      case 'change_recovery_account':
        newUsername = (op as ChangeRecoveryAccountOperation)[1]
          .account_to_recover;
        break;
      case 'claim_account':
        newUsername = (op as ClaimAccountOperation)[1].creator;
        break;
      case 'claim_reward_balance':
        newUsername = (op as ClaimRewardBalanceOperation)[1].account;
        break;
      case 'collateralized_convert':
        newUsername = (op as CollateralizedConvertOperation)[1].owner;
        break;
      case 'comment':
        newUsername = (op as CommentOperation)[1].author;
        break;
      case 'comment_options':
        newUsername = (op as CommentOptionsOperation)[1].author;
        break;
      case 'convert':
        newUsername = (op as ConvertOperation)[1].owner;
        break;
      case 'create_claimed_account':
        newUsername = (op as CreateClaimedAccountOperation)[1].creator;
        break;
      case 'create_proposal':
        newUsername = (op as CreateProposalOperation)[1].creator;
        break;
      case 'custom':
        newUsername = (op as CustomOperation)[1].required_auths?.[0];
        break;
      case 'custom_binary':
        newUsername =
          (op as CustomBinaryOperation)[1].required_auths?.[0] ||
          (op as CustomBinaryOperation)[1].required_posting_auths?.[0] ||
          (op as CustomBinaryOperation)[1].required_active_auths?.[0] ||
          (op as CustomBinaryOperation)[1].required_owner_auths?.[0];
        break;
      case 'custom_json':
        newUsername =
          (op as CustomJsonOperation)[1].required_auths?.[0] ||
          (op as CustomJsonOperation)[1].required_posting_auths?.[0];
        break;
      case 'decline_voting_rights':
        newUsername = (op as DeclineVotingRightsOperation)[1].account;
        break;
      case 'delegate_vesting_shares':
        newUsername = (op as DelegateVestingSharesOperation)[1].delegator;
        break;
      case 'delete_comment':
        newUsername = (op as DeleteCommentOperation)[1].author;
        break;
      case 'escrow_approve':
        newUsername = (op as EscrowApproveOperation)[1].who;
        break;
      case 'escrow_dispute':
        newUsername = (op as EscrowDisputeOperation)[1].who;
        break;
      case 'escrow_release':
        newUsername = (op as EscrowReleaseOperation)[1].who;
        break;
      case 'escrow_transfer':
        newUsername = (op as EscrowTransferOperation)[1].from;
        break;
      case 'feed_publish':
        newUsername = (op as FeedPublishOperation)[1].publisher;
        break;
      case 'limit_order_cancel':
        newUsername = (op as LimitOrderCancelOperation)[1].owner;
        break;
      case 'limit_order_create':
        newUsername = (op as LimitOrderCreateOperation)[1].owner;
        break;
      case 'limit_order_create2':
        newUsername = (op as LimitOrderCreate2Operation)[1].owner;
        break;
      case 'pow':
        newUsername = (op as PowOperation)[1].worker_account;
        break;
      case 'recover_account':
        newUsername = (op as RecoverAccountOperation)[1].account_to_recover;
        break;
      case 'report_over_production':
        newUsername = (op as ReportOverProductionOperation)[1].reporter;
        break;
      case 'request_account_recovery':
        newUsername = (op as RequestAccountRecoveryOperation)[1]
          .account_to_recover;
        break;
      case 'reset_account':
        newUsername = (op as ResetAccountOperation)[1].account_to_reset;
        break;
      case 'set_reset_account':
        newUsername = (op as SetResetAccountOperation)[1].account;
        break;
      case 'set_withdraw_vesting_route':
        newUsername = (op as SetWithdrawVestingRouteOperation)[1].from_account;
        break;
      case 'transfer':
        newUsername = (op as TransferOperation)[1].from;
        break;
      case 'transfer_from_savings':
        newUsername = (op as TransferFromSavingsOperation)[1].from;
        break;
      case 'transfer_to_savings':
        newUsername = (op as TransferToSavingsOperation)[1].from;
        break;
      case 'transfer_to_vesting':
        newUsername = (op as TransferToVestingOperation)[1].from;
        break;
      case 'vote':
        newUsername = (op as VoteOperation)[1].voter;
        break;
      case 'withdraw_vesting':
        newUsername = (op as WithdrawVestingOperation)[1].account;
        break;
      case 'witness_set_properties':
        newUsername = (op as WitnessSetPropertiesOperation)[1].owner;
        break;
      case 'witness_update':
        newUsername = (op as WitnessUpdateOperation)[1].owner;
        break;
      case 'update_proposal':
        newUsername = (op as UpdateProposalOperation)[1].creator;
        break;
      case 'remove_proposal':
        newUsername = (op as RemoveProposalOperation)[1].proposal_owner;
        break;
      case 'update_proposal_votes':
        newUsername = (op as UpdateProposalVotesOperation)[1].voter;
        break;
      case 'recurrent_transfer':
        newUsername = (op as RecurrentTransferOperation)[1].from;
        break;
    }
    if (username && username !== newUsername) return;
    else username = newUsername;
  }
  return username;
};

const encodeTransaction = async (
  transaction: any,
  key: string,
  receiverPubKey: string,
) => {
  return encodeMemo(key, receiverPubKey, `#${JSON.stringify(transaction)}`);
};
const encodeMetadata = async (
  metadata: any,
  key: string,
  receiverPubKey: string,
) => {
  return encodeMemo(key, receiverPubKey, `#${JSON.stringify(metadata)}`);
};

const decodeTransaction = async (
  message: string,
  key: string,
): Promise<SignedTransaction | undefined> => {
  try {
    const decodedMessage = await decodeMemo(key, message);
    const stringifiedTx = decodedMessage.substring(1);
    const parsedTx = JSON.parse(stringifiedTx);
    return parsedTx;
  } catch (err) {
    console.error('Error while decoding the transaction', err);
  }
};

const getPotentialSigners = async (
  account: ExtendedAccount,
  key: Key,
  method: KeychainKeyTypes,
) => {
  const authority =
    method === KeychainKeyTypes.active ? account?.active : account?.posting;
  let receivers: [string, number][] = [];
  if (authority) {
    for (let i = 0; i < authority.account_auths.length; i++) {
      const pk = await getPublicKeys(authority.account_auths[i][0], method);
      if (pk) {
        for (let k = 0; k < pk.length; k++) {
          receivers.push([pk[k].toString(), authority.account_auths[i][1]]);
        }
      }
    }
    for (let k = 0; k < authority.key_auths.length; k++) {
      receivers.push([
        authority.key_auths[k][0].toString(),
        authority.key_auths[k][1],
      ]);
    }
  }

  return receivers.filter(
    (r) => r[0] !== getPublicKeyFromPrivateKeyString(key!.toString()),
  );
};

const getPublicKeys = async (username: string, keyType: KeychainKeyTypes) => {
  const account = (await getClient().database.getAccounts([username]))[0];
  if (account) {
    switch (keyType) {
      case KeychainKeyTypes.active:
        return account.active.key_auths.map((key) => {
          return key[0];
        });
      case KeychainKeyTypes.posting:
        return account.posting.key_auths.map((key) => {
          return key[0];
        });
      default:
        return undefined;
    }
  }
  return undefined;
};

export interface TwoFABotConfiguration {
  name: string;
  configPath: string;
}

const get2FAAccounts = async (
  account: ExtendedAccount,
  method: KeychainKeyTypes,
) => {
  let potentialBots;
  switch (method) {
    case KeychainKeyTypes.active: {
      potentialBots = account.active.account_auths.map(([username, weigth]) => {
        return username;
      });
      break;
    }
    case KeychainKeyTypes.posting: {
      potentialBots = account.posting.account_auths.map(
        ([username, weigth]) => {
          return username;
        },
      );
      break;
    }
  }
  if (!potentialBots) {
    return [];
  }
  const extendedAccounts = await getClient().database.getAccounts(
    potentialBots,
  );
  const botNames = [];
  for (const extendedAccount of extendedAccounts) {
    const metadata = JSON.parse(extendedAccount.json_metadata || '{}');
    if (metadata.isMultisigBot) {
      botNames.push(extendedAccount.name);
    }
  }
  return botNames;
};

const getTwoFaBotUserConfig = async (configPath: string, username: string) => {
  return await new Promise((resolve, reject) => {
    try {
      fetch(`${configPath.replace(':username', username)}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      })
        .then((res) => {
          if (res && res.status === 200) {
            return res.json();
          }
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

const getMultisigInfo = async (
  keyType: KeyTypes,
  user: Partial<ActiveAccount>,
) => {
  let useMultisig = false;
  let twoFABots = {};

  switch (keyType?.toUpperCase()) {
    case KeyType.ACTIVE: {
      if (user.keys.active) {
        useMultisig = KeyUtils.isUsingMultisig(
          user.keys.active,
          user.account,
          user.keys.activePubkey?.startsWith('@')
            ? user.keys.activePubkey.replace('@', '')
            : user.account.name,
          keyType.toLowerCase() as KeychainKeyTypesLC,
        );
        if (useMultisig) {
          const accounts = await MultisigUtils.get2FAAccounts(
            user.account,
            KeychainKeyTypes.active,
          );
          accounts.forEach(
            (acc) =>
              (twoFABots = (old: TwoFABotConfiguration) => {
                return {...old, [acc]: ''};
              }),
          );
        }
      }
      break;
    }
    case KeyType.POSTING: {
      if (user.keys.posting) {
        useMultisig = KeyUtils.isUsingMultisig(
          user.keys.posting,
          user.account,
          user.keys.postingPubkey?.startsWith('@')
            ? user.keys.postingPubkey.replace('@', '')
            : user.account.name,
          keyType.toLowerCase() as KeychainKeyTypesLC,
        );

        if (useMultisig) {
          const accounts = await MultisigUtils.get2FAAccounts(
            user.account,
            KeychainKeyTypes.posting,
          );
          accounts.forEach(
            (acc) =>
              (twoFABots = (old: TwoFABotConfiguration) => {
                return {...old, [acc]: ''};
              }),
          );
        }
      }
      break;
    }
  }
  return [useMultisig, twoFABots];
};

export const MultisigUtils = {
  get2FAAccounts,
  getUsernameFromTransaction,
  saveMultisigConfig,
  getMultisigAccountConfig,
  decodeTransaction,
  encodeTransaction,
  encodeMetadata,
  getPotentialSigners,
  getMultisigInfo,
};
