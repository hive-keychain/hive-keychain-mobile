import Icon from 'components/hive/Icon';
import moment from 'moment';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
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
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';

interface TokenHistoryItemProps {
  transaction: TokenTransaction;
  useIcon?: boolean;
  ariaLabel?: string;
}

const TokenHistoryItem = ({
  transaction,
  activeAccountName,
  useIcon,
  ariaLabel,
}: TokenHistoryItemProps & PropsFromRedux) => {
  const [toggle, setToggle] = useState(false);
  let iconName = '';
  let iconNameSubType = '';

  const getLabel = () => {
    switch (transaction.operation) {
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD: {
        const t = transaction as AuthorCurationTransaction;
        return translate('wallet.operations.tokens.info_author_reward', {
          amount: withCommas(t.amount),
        });
      }
      case OperationsHiveEngine.COMMENT_CURATION_REWARD: {
        const t = transaction as CommentCurationTransaction;
        return translate(
          'wallet.operations.tokens.info_comment_curation_reward',
          {amount: withCommas(t.amount)},
        );
      }
      case OperationsHiveEngine.MINING_LOTTERY: {
        const t = transaction as MiningLotteryTransaction;
        iconName = 'claim_reward_balance';
        return translate('wallet.operations.tokens.info_mining_lottery', {
          amount: withCommas(t.amount),
          poolId: t.poolId,
        });
      }
      case OperationsHiveEngine.TOKENS_TRANSFER: {
        const t = transaction as TransferTokenTransaction;
        iconName = 'transfer';
        if (t.from === activeAccountName) {
          return translate('wallet.operations.tokens.info_transfer_out', {
            amount: withCommas(t.amount),
            to: t.to,
          });
        } else {
          return translate('wallet.operations.tokens.info_transfer_in', {
            amount: withCommas(t.amount),
            from: t.from,
          });
        }
      }
      case OperationsHiveEngine.TOKENS_DELEGATE: {
        const t = transaction as DelegateTokenTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          return translate('wallet.operations.tokens.info_delegation_out', {
            amount: withCommas(t.amount),
            delegatee: t.delegatee,
          });
        } else {
          return translate('wallet.operations.tokens.info_delegation_in', {
            delegator: t.delegator,
            amount: withCommas(t.amount),
          });
        }
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START: {
        const t = transaction as UndelegateTokenStartTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          return translate(
            'wallet.operations.tokens.info_start_cancel_delegation_out',
            {amount: withCommas(t.amount), delegatee: t.delegatee},
          );
        } else {
          return translate(
            'wallet.operations.tokens.info_start_cancel_delegation_in',
            {delegator: t.delegator, amount: withCommas(t.amount)},
          );
        }
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE: {
        const t = transaction as UndelegateTokenDoneTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          return translate(
            'wallet.operations.tokens.info_cancel_delegation_out',
            {amount: withCommas(t.amount), delegatee: t.delegatee},
          );
        } else {
          return translate(
            'wallet.operations.tokens.info_cancel_delegation_out',
            {delegator: t.delegator, amount: withCommas(t.amount)},
          );
        }
      }
      case OperationsHiveEngine.TOKEN_STAKE: {
        const t = transaction as StakeTokenTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        if (t.from !== activeAccountName) {
          return translate('wallet.operations.tokens.info_stake_other_user', {
            from: t.from,
            amount: withCommas(t.amount),
            to: t.to,
          });
        } else
          return translate('wallet.operations.tokens.info_stake', {
            amount: withCommas(t.amount),
          });
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_START: {
        const t = transaction as UnStakeTokenStartTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        return translate('wallet.operations.tokens.info_start_unstake', {
          amount: withCommas(t.amount),
        });
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_DONE: {
        const t = transaction as UnStakeTokenDoneTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        return translate('wallet.operations.tokens.info_unstake_done', {
          amount: withCommas(t.amount),
        });
      }
      case OperationsHiveEngine.TOKEN_ISSUE:
        return translate('wallet.operations.tokens.info_issue', {
          amount: withCommas(transaction.amount),
        });
      case OperationsHiveEngine.HIVE_PEGGED_BUY:
        iconName = 'convert';
        return translate('wallet.operations.tokens.info_pegged_buy', {
          amount: withCommas(transaction.amount),
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

  const toggleExpandMoreIcon = () => {
    return toggle ? (
      <Icon name={Icons.EXPAND_LESS} />
    ) : (
      <Icon name={Icons.EXPAND_MORE} />
    );
  };

  const label = getLabel();
  const memo = getMemo();
  const date = moment(transaction.timestamp * 1000).format('L');

  const color = '';

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
  });

  return label ? (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setToggle(!toggle);
        }}>
        <View style={styles.main}>
          <View style={styles.rowContainer}>
            <View style={[styles.row, styles.alignedContent]}>
              {useIcon && <Icon name={iconName} subType={iconNameSubType} />}
              <Text>{date}</Text>
            </View>
            <View>{memo && memo.length ? toggleExpandMoreIcon() : null}</View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.row}>
              <Text style={styles.username}>{label}</Text>
            </View>
          </View>
        </View>
        {toggle && memo && memo.length ? <Text>{memo}</Text> : null}
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

const getDimensionedStyles = ({height, color}: Height & {color: string}) =>
  StyleSheet.create({
    container: {
      padding: height * 0.01,
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
    },
    username: {},
    amount: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    alignedContent: {
      alignItems: 'center',
    },
  });

export const TokenHistoryItemComponent = connector(TokenHistoryItem);
