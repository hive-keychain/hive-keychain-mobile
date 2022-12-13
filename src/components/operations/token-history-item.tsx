import moment from 'moment';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {
  AuthorCurationTransaction,
  CommentCurationTransaction,
  CurationRewardTransaction,
  DelegateTokenTransaction,
  MiningLotteryTransaction,
  OperationsHiveEngine,
  StakeTokenTransaction,
  TokenTransaction,
  TransferTokenTransaction,
  UndelegateTokenDoneTransaction,
  UndelegateTokenStartTransaction,
  UnStakeTokenDoneTransaction,
  UnStakeTokenStartTransaction,
} from 'src/interfaces/tokens.interface';
import {RootState} from 'store';
import {translate} from 'utils/localize';

interface TokenHistoryItemProps {
  transaction: TokenTransaction;
  ariaLabel?: string;
}

const TokenHistoryItem = ({
  transaction,
  activeAccountName,
  ariaLabel,
}: PropsFromRedux) => {
  const [isMemoOpened, setIsMemoOpened] = useState(false);

  const getLabel = () => {
    switch (transaction.operation) {
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD: {
        const t = transaction as AuthorCurationTransaction;
        return translate('wallet.operations.tokens.info_author_reward', {
          amount: t.amount,
        });
      }
      case OperationsHiveEngine.COMMENT_CURATION_REWARD: {
        const t = transaction as CommentCurationTransaction;
        return translate(
          'wallet.operations.tokens.info_comment_curation_reward',
          {amount: t.amount},
        );
      }
      case OperationsHiveEngine.MINING_LOTTERY: {
        const t = transaction as MiningLotteryTransaction;
        return translate('wallet.operations.tokens.info_mining_lottery', {
          amount: t.amount,
          poolId: t.poolId,
        });
      }
      case OperationsHiveEngine.TOKENS_TRANSFER: {
        const t = transaction as TransferTokenTransaction;
        if (t.from === activeAccountName) {
          return translate('wallet.operations.tokens.info_transfer_out', {
            amount: t.amount,
            to: t.to,
          });
        } else {
          return translate('wallet.operations.tokens.info_transfer_in', {
            amount: t.amount,
            from: t.from,
          });
        }
      }
      case OperationsHiveEngine.TOKENS_DELEGATE: {
        const t = transaction as DelegateTokenTransaction;
        if (t.delegator === activeAccountName) {
          return translate('wallet.operations.tokens.info_delegation_out', {
            amount: t.amount,
            delegatee: t.delegatee,
          });
        } else {
          return translate('wallet.operations.tokens.info_delegation_in', {
            delegator: t.delegator,
            amount: t.amount,
          });
        }
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START: {
        const t = transaction as UndelegateTokenStartTransaction;
        if (t.delegator === activeAccountName) {
          return translate(
            'wallet.operations.tokens.info_start_cancel_delegation_out',
            {amount: t.amount, delegatee: t.delegatee},
          );
        } else {
          return translate(
            'wallet.operations.tokens.info_start_cancel_delegation_in',
            {delegator: t.delegator, amount: t.amount},
          );
        }
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE: {
        const t = transaction as UndelegateTokenDoneTransaction;
        if (t.delegator === activeAccountName) {
          return translate(
            'wallet.operations.tokens.info_cancel_delegation_out',
            {amount: t.amount, delegatee: t.delegatee},
          );
        } else {
          return translate(
            'wallet.operations.tokens.info_cancel_delegation_out',
            {delegator: t.delegator, amount: t.amount},
          );
        }
      }
      case OperationsHiveEngine.TOKEN_STAKE: {
        const t = transaction as StakeTokenTransaction;
        if (t.from !== activeAccountName) {
          return translate('wallet.operations.tokens.info_stake_other_user', {
            from: t.from,
            amount: t.amount,
            to: t.to,
          });
        } else
          return translate('wallet.operations.tokens.info_stake', {
            amount: t.amount,
          });
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_START: {
        const t = transaction as UnStakeTokenStartTransaction;
        return translate('wallet.operations.tokens.info_start_unstake', {
          amount: t.amount,
        });
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_DONE: {
        const t = transaction as UnStakeTokenDoneTransaction;
        return translate('wallet.operations.tokens.info_unstake_done', {
          amount: t.amount,
        });
      }
      case OperationsHiveEngine.TOKEN_ISSUE:
        return translate('wallet.operations.tokens.info_issue', {
          amount: transaction.amount,
        });
      case OperationsHiveEngine.HIVE_PEGGED_BUY:
        return translate('wallet.operations.tokens.info_pegged_buy', {
          amount: transaction.amount,
        });
      default:
        return null;
    }
  };

  const getMemo = () => {
    switch (transaction.operation) {
      case OperationsHiveEngine.TOKENS_TRANSFER: {
        const t = transaction as TransferTokenTransaction;
        return t.memo;
      }
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD:
      case OperationsHiveEngine.COMMENT_CURATION_REWARD: {
        const t = transaction as CurationRewardTransaction;
        return t.authorPerm;
      }
      default:
        return null;
    }
  };

  const label = getLabel();
  return label ? (
    <View
      aria-label={ariaLabel}
      // id={transaction._id}
      // className={`token-history-item ${getMemo() ? 'has-memo' : ''}`}
    >
      <TouchableOpacity onPress={() => setIsMemoOpened(!isMemoOpened)}>
        <View
        // className="transaction"
        >
          <View
          // className="information-panel"
          >
            <View
            // className="top-row"
            >
              <View
              // className="date"
              >
                <Text>{moment(transaction.timestamp * 1000).format('L')}</Text>
              </View>
            </View>
            <View
            //className="bottom-row"
            >
              <Text>{label}</Text>
            </View>
          </View>
          {isMemoOpened && (
            <View
            // className={isMemoOpened ? 'memo-panel opened' : 'memo-panel closed'}
            >
              <Text>{getMemo()}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  ) : null;
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccountName: state.activeAccount.name,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector> & TokenHistoryItemProps;

export const TokenHistoryItemComponent = connector(TokenHistoryItem);
