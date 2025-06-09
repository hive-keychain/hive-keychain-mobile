import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import {
  KeychainRequestTypes,
  RequestVscWithdrawal,
  VscUtils,
} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {default as Toast} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonHeight} from 'src/styles/button';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {VSCConfig} from 'utils/config';
import {
  beautifyTransferError,
  capitalize,
  getCleanAmountValue,
  withCommas,
} from 'utils/format';
import {broadcastJson} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {TransferUtils} from 'utils/transfer.utils';
import Balance from './Balance';
import {ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export type VscWithdrawProps = {
  currency: string;
  tokenBalance: string;
  tokenLogo: JSX.Element;
};

type Props = PropsFromRedux & VscWithdrawProps;

const VscWithdraw = ({
  currency,
  user,
  tokenBalance,
  tokenLogo,
  phishingAccounts,
  showModal,
  localAccounts,
}: Props) => {
  const [to, setTo] = useState(user.name);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isMemoEncrypted, setIsMemoEncrypted] = useState<boolean>(false);
  const [actualCurrency, setActualCurrency] = useState<string>(
    currency.toUpperCase().includes('VSC')
      ? currency.replace('VSC', '')
      : currency,
  );

  const [availableBalance, setAvailableBalance] = useState('');
  const {theme} = useThemeContext();

  const transferVsc = async (options: TransactionOptions, memo?: string) => {
    const data: RequestVscWithdrawal = {
      type: KeychainRequestTypes.vscWithdrawal,
      username: user.name,
      to: sanitizeUsername(to),
      amount: sanitizeAmount(parseFloat(amount).toFixed(3)),
      memo: memo,
      currency: actualCurrency,
      domain: '',
      netId: VSCConfig.BASE_JSON.net_id,
    };

    const {json, id} = VscUtils.getWithdrawJson(
      data,
      VSCConfig.BASE_JSON.net_id,
    );
    await broadcastJson(user.keys.active, user.name, id, true, json, options);
  };

  const onSend = async (options: TransactionOptions) => {
    try {
      if (isMemoEncrypted && !user.keys.memo)
        return showModal(
          translate('toast.missing_memo_key', {account: user.name}),
          MessageModalType.ERROR,
        );

      await transferVsc(options, memo);
      if (options.multisig) return;
      showModal('toast.transfer_success', MessageModalType.SUCCESS);
    } catch (e) {
      showModal(
        beautifyTransferError(e as any, {
          to,
          currency: actualCurrency,
          username: user.account.name,
        }),
        MessageModalType.ERROR,
        undefined,
        true,
      );
    }
  };

  const onSendConfirmation = () => {
    if (!amount.length || !to.length) {
      Toast.show(translate('wallet.operations.withdraw.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(availableBalance)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency: actualCurrency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        title: 'wallet.operations.withdraw.confirm.info',
        onSend,
        skipWarningTranslation: true,
        warningText: TransferUtils.getTransferWarningLabel(
          to,
          actualCurrency,
          memo,
          phishingAccounts,
          false,
          false,
        ),
        data: [
          {
            value: `@${to}`,
            title: 'wallet.operations.withdraw.confirm.to',
          },
          {
            title: 'wallet.operations.withdraw.confirm.amount',
            value: `${withCommas(amount)} ${actualCurrency}`,
          },
        ],
        keyType: KeyType.ACTIVE,
      };
      if (memo.length)
        confirmationData.data.push({
          title: 'wallet.operations.withdraw.confirm.memo',
          value: `${
            memo.trim().length > 25 ? memo.substring(0, 22) + '...' : memo
          } ${isMemoEncrypted ? '(encrypted)' : ''}`,
        });
      navigate('ConfirmationPage', confirmationData);
    }
  };

  const renderSend = () => (
    <View>
      <Separator height={35} />
      <OperationInput
        testID="username-input-testID"
        nativeID="username-input"
        labelInput={translate('common.to')}
        placeholder={translate('common.username')}
        leftIcon={<Icon name={Icons.AT} theme={theme} />}
        autoCapitalize="none"
        value={to}
        onChangeText={(e) => {
          setTo(e.trim());
        }}
      />
      <Separator />
      <View style={[styles.flexRowBetween, {zIndex: -1}]}>
        <OperationInput
          labelInput={translate('common.currency')}
          placeholder={actualCurrency}
          value={actualCurrency}
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
                additionalLineStyle={getHorizontalLineStyle(theme, 1, 35, 16)}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  setAmount(getCleanAmountValue(availableBalance))
                }>
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
      <Separator />
      <View style={{zIndex: -1}}>
        <OperationInput
          labelInput={capitalize(translate('common.memo'))}
          placeholder={translate('wallet.operations.withdraw.memo')}
          value={memo}
          trim={false}
          onChangeText={setMemo}
          rightIcon={
            <View style={styles.flexRowCenter}>
              <Separator
                drawLine
                additionalLineStyle={getHorizontalLineStyle(theme, 1, 35, 16)}
              />
              <Icon
                name={isMemoEncrypted ? Icons.ENCRYPT : Icons.DECRYPT}
                theme={theme}
                onPress={() => setIsMemoEncrypted(!isMemoEncrypted)}
                color={PRIMARY_RED_COLOR}
              />
            </View>
          }
        />
      </View>
    </View>
  );

  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);

  return (
    <View style={{flex: 1}}>
      <OperationThemed
        childrenTop={
          <>
            <Separator />
            <Balance
              currency={currency}
              account={user.account}
              tokenBalance={tokenBalance}
              tokenLogo={tokenLogo}
              isHiveEngine={false}
              setAvailableBalance={(available: string) =>
                setAvailableBalance(available)
              }
              theme={theme}
            />
            <Separator />
          </>
        }
        childrenMiddle={renderSend()}
        buttonTitle={'common.next'}
        onNext={onSendConfirmation}
        additionalContentContainerStyle={styles.paddingHorizontal}
        method={KeyTypes.active}
      />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    warning: {color: 'red'},
    titleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      opacity: 0.7,
    },
    operationButtonsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'space-around',
      width: '100%',
    },
    operationButton: {
      width: '48%',
      marginHorizontal: 0,
      height: getButtonHeight(width),
    },
    paddingHorizontal: {
      paddingHorizontal: 18,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      localAccounts: state.accounts,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(VscWithdraw);
