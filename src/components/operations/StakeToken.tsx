import {loadAccount, loadUserTokens} from 'actions/index';
import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, getCleanAmountValue, withCommas} from 'utils/format';
import {stakeToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {BlockchainTransactionUtils} from 'utils/tokens.utils';
import Balance from './Balance';
import {
  ConfirmationDataTag,
  ConfirmationPageProps,
  createBalanceData,
} from './Confirmation';
import OperationThemed from './OperationThemed';

export interface StakeTokenOperationProps {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
  gobackAction?: () => void;
}

type Props = PropsFromRedux & StakeTokenOperationProps;

const StakeToken = ({
  currency,
  user,
  balance,
  properties,
  tokenLogo,
  showModal,
}: Props) => {
  const [amount, setAmount] = useState('');

  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  const onStakeToken = async (options: TransactionOptions) => {
    try {
      const tokenOperationResult: any = await stakeToken(
        user.keys.active,
        user.name!,
        {
          to: sanitizeUsername(user.name!),
          symbol: currency,
          quantity: sanitizeAmount(amount),
        },
        options,
      );
      if (options.multisig) return;

      if (tokenOperationResult && tokenOperationResult.tx_id) {
        let confirmationResult: any = await BlockchainTransactionUtils.tryConfirmTransaction(
          tokenOperationResult.tx_id,
        );

        if (confirmationResult && confirmationResult.confirmed) {
          if (confirmationResult.error) {
            showModal('toast.hive_engine_error', MessageModalType.ERROR, {
              error: confirmationResult.error,
            });
          } else {
            showModal('toast.token_stake_success', MessageModalType.SUCCESS, {
              currency,
            });
          }
        } else {
          showModal('toast.token_timeout', MessageModalType.ERROR);
        }
      } else {
        showModal('toast.tokens_operation_failed', MessageModalType.ERROR, {
          tokenOperation: 'stake',
        });
      }
    } catch (e) {
      showModal(
        `Error : ${(e as any).message}`,
        MessageModalType.ERROR,
        null,
        true,
      );
    }
  };

  const onStakeConfirmation = () => {
    if (!amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(balance)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onStakeToken,
        keyType: KeyType.ACTIVE,
        title: 'wallet.operations.token_stake.confirm.info',
        data: [
          {
            title: 'common.account',
            value: `@${user.account.name}`,
            tag: ConfirmationDataTag.USERNAME,
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: withCommas(amount),
            tag: ConfirmationDataTag.AMOUNT,
            currency: currency,
            currentBalance: balance,
            amount: amount,
            finalBalance: (parseFloat(balance) - parseFloat(amount)).toString(),
          },
          createBalanceData(
            'wallet.operations.token_stake.confirm.balance',
            parseFloat(balance.replace(/,/g, '')),
            parseFloat(amount),
            currency,
          ),
        ],
      };
      navigate('ConfirmationPage', confirmationData);
    }
  };

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <Balance
            currency={currency}
            account={user.account}
            isHiveEngine
            globalProperties={properties.globals}
            tokenLogo={tokenLogo}
            tokenBalance={balance}
            theme={theme}
          />
          <Separator />
        </>
      }
      childrenMiddle={
        <View style={styles.childrenMiddle}>
          <Caption text="wallet.operations.token_stake.info" />
          <View style={styles.flexRowBetween}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={currency}
              value={currency}
              editable={false}
              additionalOuterContainerStyle={{
                width: '40%',
              }}
            />
            <OperationInput
              keyboardType="decimal-pad"
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0'}
              value={amount}
              onChangeText={setAmount}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setAmount(
                        parseFloat(getCleanAmountValue(balance)).toFixed(3),
                      );
                    }}>
                    <Text
                      style={
                        getFormFontStyle(height, theme, PRIMARY_RED_COLOR).input
                      }>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      }
      buttonTitle={'common.stake'}
      onNext={onStakeConfirmation}
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    button: {marginBottom: 20},
    infoText: {
      color: getColors(theme).septenaryText,
      opacity: theme === Theme.DARK ? 0.6 : 1,
      paddingHorizontal: 15,
    },
    childrenMiddle: {
      flex: 1,
      paddingHorizontal: 10,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StakeToken);
