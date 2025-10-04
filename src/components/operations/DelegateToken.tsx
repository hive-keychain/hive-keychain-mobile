import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
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
import Toast from 'react-native-root-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {ConfirmationDataTag} from 'src/interfaces/confirmation.interface';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCurrencyProperties} from 'src/lists/hiveReact.list';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, getCleanAmountValue, withCommas} from 'utils/format.utils';
import {sanitizeAmount, sanitizeUsername} from 'utils/hive.utils';
import {delegateToken} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';
import {BlockchainTransactionUtils} from 'utils/tokens.utils';
import Balance from './Balance';
import {ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export interface DelegateTokenOperationProps {
  currency: string;
  tokenLogo: React.ReactNode;
  balance: string;
  sendTo?: string;
  delegateAmount?: string;
  update?: boolean;
  gobackAction?: () => void;
}

type Props = PropsFromRedux & DelegateTokenOperationProps;

const DelegateToken = ({
  currency,
  user,
  sendTo,
  delegateAmount,
  tokenLogo,
  balance,
  update,
  showModal,
}: Props) => {
  const [to, setTo] = useState(sendTo || '');
  const [amount, setAmount] = useState(delegateAmount || '');

  const onDelegateToken = async (options: TransactionOptions) => {
    try {
      const tokenOperationResult: any = await delegateToken(
        user.keys.active,
        user.name!,
        {
          to: sanitizeUsername(to),
          symbol: currency,
          quantity: sanitizeAmount(amount),
        },
        options,
      );
      if (options.multisig) return;

      if (tokenOperationResult && tokenOperationResult.tx_id) {
        let confirmationResult: any =
          await BlockchainTransactionUtils.tryConfirmTransaction(
            tokenOperationResult.tx_id,
          );

        if (confirmationResult && confirmationResult.confirmed) {
          if (confirmationResult.error) {
            showModal('toast.hive_engine_error', MessageModalType.ERROR, {
              error: confirmationResult.error,
            });
          } else {
            showModal('toast.token_delegate_sucess', MessageModalType.SUCCESS, {
              currency,
            });
          }
        } else {
          showModal('toast.token_timeout', MessageModalType.ERROR);
        }
      } else {
        showModal('toast.tokens_operation_failed', MessageModalType.ERROR, {
          tokenOperation: 'delegate',
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

  const onDelegateConfirmation = async () => {
    if (!to || !amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(balance)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onDelegateToken,
        title: 'wallet.operations.token_delegation.confirm.info',
        data: [
          {
            title: 'wallet.operations.transfer.confirm.from',
            value: `@${user.account.name}`,
            tag: ConfirmationDataTag.USERNAME,
          },
          {
            title: 'wallet.operations.transfer.confirm.to',
            value: `@${to}`,
            tag: ConfirmationDataTag.USERNAME,
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: withCommas(amount),
            tag: ConfirmationDataTag.AMOUNT,
            currency: currency,
          },
        ],
        keyType: KeyType.ACTIVE,
      };
      navigate('ConfirmationPage', confirmationData);
    }
  };

  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <Balance
            currency={currency}
            account={user.account}
            isHiveEngine
            tokenLogo={tokenLogo}
            tokenBalance={balance}
            theme={theme}
          />
        </>
      }
      childrenMiddle={
        <View style={{flex: 1}}>
          <Caption text={`wallet.operations.token_delegation.info`} />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon name={Icons.AT} theme={theme} />}
            autoCapitalize="none"
            value={to}
            onChangeText={setTo}
          />
          <Separator />
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
                    onPress={() => setAmount(getCleanAmountValue(balance))}>
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
      buttonTitle={update ? 'common.confirm' : 'common.delegate'}
      onNext={onDelegateConfirmation}
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
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegateToken);
