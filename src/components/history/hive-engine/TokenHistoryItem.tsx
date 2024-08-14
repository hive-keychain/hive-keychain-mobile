import CustomAmountLabel, {
  LabelDataType,
} from 'components/form/CustomAmountLabel';
import Icon from 'components/hive/Icon';
import moment from 'moment';
import React, {useState} from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme} from 'src/context/theme.context';
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
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {fields_primary_text_1} from 'src/styles/typography';
import {RootState} from 'store';
import {formatBalanceCurrency} from 'utils/format';
import {translate} from 'utils/localize';

interface TokenHistoryItemProps {
  transaction: TokenTransaction;
  useIcon?: boolean;
  ariaLabel?: string;
  theme: Theme;
}

const TokenHistoryItem = ({
  transaction,
  activeAccountName,
  useIcon,
  ariaLabel,
  theme,
}: TokenHistoryItemProps & PropsFromRedux) => {
  const [toggle, setToggle] = useState(false);
  const localePrefix = 'wallet.operations.tokens';
  let labelDataList: LabelDataType[];

  const getLabelsComponents = () => {
    function returnWithList(labelDataList: any) {
      return (
        <CustomAmountLabel
          list={labelDataList}
          translatePrefix={localePrefix}
          theme={theme}
        />
      );
    }
    transaction.amount = formatBalanceCurrency(transaction.amount);
    switch (transaction.operation) {
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD: {
        const t = transaction as AuthorCurationTransaction;
        labelDataList = [
          {
            label: 'info_author_reward',
            data: {
              amount: t.amount,
            },
          },
        ];
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.COMMENT_CURATION_REWARD: {
        const t = transaction as CommentCurationTransaction;

        labelDataList = [
          {
            label: 'info_comment_curation_reward',
            data: {
              amount: t.amount,
            },
          },
        ];
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.MINING_LOTTERY: {
        const t = transaction as MiningLotteryTransaction;
        labelDataList = [
          {
            label: 'info_mining_lottery',
            data: {
              amount: t.amount,
            },
          },
        ];
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKENS_TRANSFER: {
        const t = transaction as TransferTokenTransaction;
        if (t.from === activeAccountName) {
          labelDataList = [
            {
              label: 'info_transfer_out',
              data: {
                amount: t.amount,
                to: t.to,
              },
            },
          ];
        } else {
          labelDataList = [
            {label: 'info_transfer_in', data: {amount: t.amount, from: t.from}},
          ];
        }
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKENS_DELEGATE: {
        const t = transaction as DelegateTokenTransaction;
        if (t.delegator === activeAccountName) {
          labelDataList = [
            {
              label: 'info_delegation_out',
              data: {
                amount: t.amount,
                delegatee: t.delegatee,
              },
            },
          ];
        } else {
          labelDataList = [
            {
              label: 'info_delegation_in',
              data: {delegator: t.delegator, amount: t.amount},
            },
          ];
        }
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START: {
        const t = transaction as UndelegateTokenStartTransaction;
        if (t.delegator === activeAccountName) {
          labelDataList = [
            {
              label: 'info_start_cancel_delegation_out',
              data: {
                amount: t.amount,
                delegatee: t.delegatee,
              },
            },
          ];
        } else {
          labelDataList = [
            {
              label: 'info_start_cancel_delegation_in',
              data: {delegator: t.delegator, amount: t.amount},
            },
          ];
        }
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE: {
        const t = transaction as UndelegateTokenDoneTransaction;
        if (t.delegator === activeAccountName) {
          labelDataList = [
            {
              label: 'info_cancel_delegation_out',
              data: {delegatee: t.delegatee, amount: t.amount},
            },
          ];
        } else {
          labelDataList = [
            {
              label: 'info_cancel_delegation_in',
              data: {
                delegator:
                  t.delegator ?? translate('common.unknown_data.value'),
                amount: t.amount,
              },
            },
          ];
        }
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_STAKE: {
        const t = transaction as StakeTokenTransaction;
        if (t.from !== activeAccountName) {
          labelDataList = [
            {
              label: 'info_stake_other_user',
              data: {from: t.from, amount: t.amount, to: t.to},
            },
          ];
        } else {
          labelDataList = [
            {
              label: 'info_stake',
              data: {amount: t.amount},
            },
          ];
        }
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_START: {
        const t = transaction as UnStakeTokenStartTransaction;
        labelDataList = [
          {
            label: 'info_start_unstake',
            data: {amount: t.amount},
          },
        ];
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_UNSTAKE_DONE: {
        const t = transaction as UnStakeTokenDoneTransaction;
        labelDataList = [
          {
            label: 'info_unstake_done',
            data: {amount: t.amount},
          },
        ];
        return returnWithList(labelDataList);
      }
      case OperationsHiveEngine.TOKEN_ISSUE:
        labelDataList = [
          {
            label: 'info_issue',
            data: {amount: formatBalanceCurrency(transaction.amount)},
          },
        ];
        return returnWithList(labelDataList);
      case OperationsHiveEngine.HIVE_PEGGED_BUY:
        labelDataList = [
          {
            label: 'info_pegged_buy',
            data: {amount: formatBalanceCurrency(transaction.amount)},
          },
        ];
        return returnWithList(labelDataList);

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

  const label = getLabelsComponents();
  const memo = getMemo();
  const date = moment(transaction.timestamp * 1000).format('L');

  const styles = getDimensionedStyles(
    {
      ...useWindowDimensions(),
    },
    theme,
  );

  const getTokenIconName = (operationType: OperationsHiveEngine) => {
    switch (operationType) {
      case OperationsHiveEngine.TOKENS_TRANSFER:
      case OperationsHiveEngine.TOKEN_ISSUE:
        return Icons.TRANSFER;
      case OperationsHiveEngine.COMMENT_CURATION_REWARD:
      case OperationsHiveEngine.COMMENT_AUTHOR_REWARD:
        return Icons.CLAIM_REWARD_BALANCE;
      case OperationsHiveEngine.TOKENS_DELEGATE:
      case OperationsHiveEngine.TOKEN_UNDELEGATE_START:
      case OperationsHiveEngine.TOKEN_UNDELEGATE_DONE:
        return Icons.DELEGATE_TOKEN;
      case OperationsHiveEngine.MINING_LOTTERY:
        return Icons.SAVINGS;
      case OperationsHiveEngine.HIVE_PEGGED_BUY:
        return Icons.CONVERT;
      case OperationsHiveEngine.TOKEN_STAKE:
        return Icons.STAKE;
      case OperationsHiveEngine.TOKEN_UNSTAKE_START:
      case OperationsHiveEngine.TOKEN_UNSTAKE_DONE:
        return Icons.UNSTAKE;
    }
  };

  return label ? (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        disabled={!memo}
        style={styles.container}
        onPress={() => {
          setToggle(!toggle);
        }}>
        <View style={styles.main}>
          <View style={styles.rowContainerSpaced}>
            <View style={[styles.row]}>
              {useIcon && (
                <View
                  style={{
                    backgroundColor: '#E313371A',
                    padding: 8,
                    borderRadius: 16,
                    borderTopRightRadius: 0,
                  }}>
                  <Icon
                    name={getTokenIconName(transaction.operation)}
                    theme={theme}
                    additionalContainerStyle={styles.iconContainer}
                    color={PRIMARY_RED_COLOR}
                  />
                </View>
              )}
              <View style={styles.label}>{label}</View>
              <Text style={[styles.text, {marginRight: 4}]}>{date}</Text>
            </View>
          </View>
        </View>
        {toggle && memo && memo.length ? (
          <Text style={[styles.text, styles.padding]}>{memo}</Text>
        ) : null}
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

const getDimensionedStyles = ({width, height}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 5,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      marginBottom: 9,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
    },
    username: {},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
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
    separator: {marginVertical: 3, borderBottomWidth: 1},
    iconContainer: {
      width: width / 9,
      height: width / 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    text: {
      ...fields_primary_text_1,
      color: getColors(theme).secondaryText,
    },
    padding: {
      padding: 8,
    },
    label: {flex: 1, marginHorizontal: 8},
  });

export const TokenHistoryItemComponent = connector(TokenHistoryItem);
