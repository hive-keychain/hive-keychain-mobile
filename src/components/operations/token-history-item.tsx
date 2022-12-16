import CustomAmountLabel, {
  LabelAmount,
} from 'components/form/CustomAmountLabel';
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
//TODO refactor gerLabels as it is to much lines of code. IP:SR
const TokenHistoryItem = ({
  transaction,
  activeAccountName,
  useIcon,
  ariaLabel,
}: TokenHistoryItemProps & PropsFromRedux) => {
  const [toggle, setToggle] = useState(false);
  let iconName = '';
  let iconNameSubType = '';

  const getLabelsComponents = () => {
    let labelList: LabelAmount[];
    function returnWithList(from: string, to: string) {
      return (
        <CustomAmountLabel
          list={labelList}
          from={from}
          to={to}
          user={activeAccountName}
        />
      );
    }

    switch (transaction.operation) {
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD: {
        const t = transaction as AuthorCurationTransaction;
        // return translate('wallet.operations.tokens.info_author_reward', {
        //   amount: withCommas(t.amount),
        // });
        labelList = [
          {
            label: translate(
              'wallet.operations.tokens.info_author_reward.part_1',
            ),
          },
          {
            label: translate(
              'wallet.operations.tokens.info_author_reward.amount',
              {
                amount: withCommas(t.amount),
              },
            ),
            isAmount: true,
          },
          {
            label: translate(
              'wallet.operations.tokens.info_author_reward.part_2',
            ),
          },
        ];
        return returnWithList(activeAccountName, '');
      }
      case OperationsHiveEngine.COMMENT_CURATION_REWARD: {
        const t = transaction as CommentCurationTransaction;
        // return translate(
        //   'wallet.operations.tokens.info_comment_curation_reward',
        //   {amount: withCommas(t.amount)},
        // );
        labelList = [
          {
            label: translate(
              'wallet.operations.tokens.info_comment_curation_reward.part_1',
            ),
          },
          {
            label: translate(
              'wallet.operations.tokens.info_comment_curation_reward.amount',
              {
                amount: withCommas(t.amount),
              },
            ),
            isAmount: true,
          },
          {
            label: translate(
              'wallet.operations.tokens.info_comment_curation_reward.part_2',
            ),
          },
        ];
        return returnWithList(activeAccountName, '');
      }
      case OperationsHiveEngine.MINING_LOTTERY: {
        const t = transaction as MiningLotteryTransaction;
        iconName = 'claim_reward_balance';
        // return translate('wallet.operations.tokens.info_mining_lottery', {
        //   amount: withCommas(t.amount),
        //   poolId: t.poolId,
        // });
        labelList = [
          {
            label: translate(
              'wallet.operations.tokens.info_mining_lottery.part_1',
            ),
          },
          {
            label: translate(
              'wallet.operations.tokens.info_mining_lottery.amount',
              {
                amount: withCommas(t.amount),
              },
            ),
            isAmount: true,
          },
          {
            label: translate(
              'wallet.operations.tokens.info_mining_lottery.part_2',
              {poolId: t.poolId},
            ),
          },
        ];
        return returnWithList(activeAccountName, '');
      }
      case OperationsHiveEngine.TOKENS_TRANSFER: {
        const t = transaction as TransferTokenTransaction;
        iconName = 'transfer';
        if (t.from === activeAccountName) {
          // return translate('wallet.operations.tokens.info_transfer_out', {
          //   amount: withCommas(t.amount),
          //   to: t.to,
          // });
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_out.part_1',
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_out.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_out.part_2',
                {to: t.to},
              ),
            },
          ];
        } else {
          // return translate('wallet.operations.tokens.info_transfer_in', {
          //   amount: withCommas(t.amount),
          //   from: t.from,
          // });
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_in.part_1',
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_in.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_in.part_2',
                {from: t.from},
              ),
            },
          ];
        }
        return returnWithList(t.from, t.to);
      }
      case OperationsHiveEngine.TOKENS_DELEGATE: {
        const t = transaction as DelegateTokenTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_delegation_out.part_1',
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_delegation_out.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_transfer_in.part_2',
                {delegatee: t.delegatee},
              ),
            },
          ];
        } else {
          // return translate('wallet.operations.tokens.info_delegation_in', {
          //   delegator: t.delegator,
          //   amount: withCommas(t.amount),
          // });
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_delegation_in.part_1',
                {delegator: t.delegator},
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_delegation_out.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
          ];
        }
        return returnWithList(t.delegatee, '');
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START: {
        const t = transaction as UndelegateTokenStartTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          // return translate(
          //   'wallet.operations.tokens.info_start_cancel_delegation_out',
          //   {amount: withCommas(t.amount), delegatee: t.delegatee},
          // );
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_start_cancel_delegation_out.part_1',
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_delegation_out.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_start_cancel_delegation_out.part_2',
                {delegatee: t.delegatee},
              ),
            },
          ];
        } else {
          // return translate(
          //   'wallet.operations.tokens.info_start_cancel_delegation_in',
          //   {delegator: t.delegator, amount: withCommas(t.amount)},
          // );
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_start_cancel_delegation_in.part_1',
                {delegator: t.delegator},
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_start_cancel_delegation_in.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_start_cancel_delegation_in.part_2',
              ),
            },
          ];
        }
        return returnWithList(t.delegatee, '');
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE: {
        const t = transaction as UndelegateTokenDoneTransaction;
        iconName = 'delegate_vesting_shares';
        if (t.delegator === activeAccountName) {
          // return translate(
          //   'wallet.operations.tokens.info_cancel_delegation_out',
          //   {amount: withCommas(t.amount), delegatee: t.delegatee},
          // );
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_out.part_1',
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_out.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_out.part_2',
                {delegatee: t.delegatee},
              ),
            },
          ];
        } else {
          // return translate(
          //   'wallet.operations.tokens.info_cancel_delegation_out',
          //   {delegator: t.delegator, amount: withCommas(t.amount)},
          // );
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_in.part_1',
                {delegator: t.delegator},
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_in.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_cancel_delegation_out.part_2',
              ),
            },
          ];
        }
        return returnWithList(t.delegatee, '');
      }
      case OperationsHiveEngine.TOKEN_STAKE: {
        const t = transaction as StakeTokenTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        if (t.from !== activeAccountName) {
          // return translate('wallet.operations.tokens.info_stake_other_user', {
          //   from: t.from,
          //   amount: withCommas(t.amount),
          //   to: t.to,
          // });
          labelList = [
            {
              label: translate(
                'wallet.operations.tokens.info_stake_other_user.part_1',
                {from: t.from},
              ),
            },
            {
              label: translate(
                'wallet.operations.tokens.info_stake_other_user.amount',
                {
                  amount: withCommas(t.amount),
                },
              ),
              isAmount: true,
            },
            {
              label: translate(
                'wallet.operations.tokens.info_stake_other_user.part_2',
                {to: t.to},
              ),
            },
          ];
        }
        // return translate('wallet.operations.tokens.info_stake', {
        //   amount: withCommas(t.amount),
        // });
        else {
          labelList = [
            {
              label: translate('wallet.operations.tokens.info_stake.part_1'),
            },
            {
              label: translate('wallet.operations.tokens.info_stake.amount', {
                amount: withCommas(t.amount),
              }),
              isAmount: true,
            },
          ];
        }
        return returnWithList(t.from, '');
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_START: {
        const t = transaction as UnStakeTokenStartTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        // return translate('wallet.operations.tokens.info_start_unstake', {
        //   amount: withCommas(t.amount),
        // });
        labelList = [
          {
            label: translate(
              'wallet.operations.tokens.info_start_unstake.part_1',
            ),
          },
          {
            label: translate(
              'wallet.operations.tokens.info_start_unstake.amount',
              {
                amount: withCommas(t.amount),
              },
            ),
            isAmount: true,
          },
        ];
        return returnWithList(activeAccountName, '');
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_DONE: {
        const t = transaction as UnStakeTokenDoneTransaction;
        iconName = 'power_up_down';
        iconNameSubType = 'transfer_to_vesting';
        // return translate('wallet.operations.tokens.info_unstake_done', {
        //   amount: withCommas(t.amount),
        // });
        labelList = [
          {
            label: translate(
              'wallet.operations.tokens.info_unstake_done.amount',
              {
                amount: withCommas(t.amount),
              },
            ),
            isAmount: true,
          },
          {
            label: translate(
              'wallet.operations.tokens.info_unstake_done.part_1',
            ),
          },
        ];
        return returnWithList(activeAccountName, '');
      }
      case OperationsHiveEngine.TOKEN_ISSUE:
        // return translate('wallet.operations.tokens.info_issue', {
        //   amount: withCommas(transaction.amount),
        // });
        labelList = [
          {
            label: translate('wallet.operations.tokens.info_issue.part_1'),
          },
          {
            label: translate('wallet.operations.tokens.info_issue.amount', {
              amount: withCommas(transaction.amount),
            }),
            isAmount: true,
          },
        ];
        return returnWithList(activeAccountName, '');
      case OperationsHiveEngine.HIVE_PEGGED_BUY:
        iconName = 'convert';
        // return translate('wallet.operations.tokens.info_pegged_buy', {
        //   amount: withCommas(transaction.amount),
        // });
        labelList = [
          {
            label: translate('wallet.operations.tokens.info_pegged_buy.part_1'),
          },
          {
            label: translate(
              'wallet.operations.tokens.info_pegged_buy.amount',
              {
                amount: withCommas(transaction.amount),
              },
            ),
            isAmount: true,
          },
        ];
        return returnWithList(activeAccountName, '');
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

  const label = getLabelsComponents();
  // const label = (
  //   <CustomAmountLabel
  //     list={[
  //       {
  //         label: translate(
  //           'wallet.operations.tokens.info_author_reward.part_1',
  //         ),
  //       },
  //       {
  //         label: translate(
  //           'wallet.operations.tokens.info_author_reward.amount',
  //           {amount: '1 HIVE'},
  //         ),
  //         isAmount: true,
  //       },
  //       {
  //         label: translate(
  //           'wallet.operations.tokens.info_author_reward.part_2',
  //         ),
  //       },
  //     ]}
  //     from={'theghost1980'}
  //     to={'keychain.tests'}
  //     user={activeAccountName}
  //   />
  // );

  const memo = getMemo();
  const date = moment(transaction.timestamp * 1000).format('L');

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
  });

  return label ? (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setToggle(!toggle);
        }}>
        <View style={styles.main}>
          <View style={styles.rowContainerSpaced}>
            <View style={[styles.row, styles.alignedContent]}>
              {useIcon && <Icon name={iconName} subType={iconNameSubType} />}
              <Text>{date}</Text>
            </View>
            <View>{memo && memo.length ? toggleExpandMoreIcon() : null}</View>
          </View>
          {/* <View style={styles.rowContainerSpaced}>
            <View style={styles.row}>
              <Text style={styles.username}>{label}</Text>
            </View>
          </View> */}
          {label}
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

const getDimensionedStyles = ({height}: Height) =>
  StyleSheet.create({
    container: {
      padding: height * 0.01,
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
    },
    username: {},
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    rowContainerSpaced: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rowContainer: {
      flexDirection: 'row',
    },
    alignedContent: {
      alignItems: 'center',
    },
  });

export const TokenHistoryItemComponent = connector(TokenHistoryItem);
