import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import {encodeMemo} from 'components/bridge';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import OptionsToggle from 'components/ui/OptionsToggle';
import ScreenToggle from 'components/ui/ScreenToggle';
import Separator from 'components/ui/Separator';
import {ExchangesUtils} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {default as Toast} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {AutoCompleteValues} from 'src/interfaces/autocomplete.interface';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonHeight} from 'src/styles/button';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {FavoriteUserUtils} from 'utils/favorite-user.utils';
import {
  beautifyTransferError,
  capitalize,
  getCleanAmountValue,
  withCommas,
} from 'utils/format';
import {recurrentTransfer, sendToken, transfer} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {
  getAccountKeys,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {TransferUtils} from 'utils/transfer.utils';
import Balance from '../Balance';
import {ConfirmationPageProps} from '../Confirmation';
import OperationThemed from '../OperationThemed';

export type TransferOperationProps = {
  currency: string;
  engine: boolean;
  tokenBalance: string;
  tokenLogo: JSX.Element;
};
type Props = PropsFromRedux & TransferOperationProps;
const Transfer = ({
  currency,
  user,
  engine,
  tokenBalance,
  tokenLogo,
  phishingAccounts,
  showModal,
  localAccounts,
}: Props) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [amountReceive, setAmountReceive] = useState('');
  const [memoReceive, setMemoReceive] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [exec, setExec] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecurrent, setRecurrent] = useState(false);
  const [isMemoEncrypted, setIsMemoEncrypted] = useState<boolean>(false);

  const [autocompleteFavoriteUsers, setAutocompleteFavoriteUsers] = useState<
    AutoCompleteValues
  >({
    categories: [],
  });
  const [availableBalance, setAvailableBalance] = useState('');
  const [toggleIndex, setToggleIndex] = useState(0);
  const {theme} = useThemeContext();

  useEffect(() => {
    loadAutocompleteTransferUsernames();
  }, []);

  const loadAutocompleteTransferUsernames = async () => {
    const autoCompleteListByCategories: AutoCompleteValues = await FavoriteUserUtils.getAutocompleteListByCategories(
      user.name!,
      localAccounts,
      {addExchanges: true, token: currency.toUpperCase()},
    );
    setAutocompleteFavoriteUsers(autoCompleteListByCategories);
  };

  const sendTransfer = async (options: TransactionOptions) => {
    setLoading(true);
    let finalMemo = memo;
    if (isMemoEncrypted) {
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(user.keys.memo, receiverMemoKey, `#${memo}`);
    }
    if (!isRecurrent) {
      await transfer(
        user.keys.active,
        {
          amount: sanitizeAmount(amount, currency),
          memo: finalMemo,
          to: sanitizeUsername(to),
          from: user.account.name,
        },
        options,
      );
    } else {
      await recurrentTransfer(
        user.keys.active,
        {
          amount: sanitizeAmount(amount, currency),
          memo: finalMemo,
          to: sanitizeUsername(to),
          from: user.account.name,
          recurrence: +recurrence,
          executions: +exec,
          extensions: [],
        },
        options,
      );
    }
  };

  const transferToken = async (options: TransactionOptions) => {
    setLoading(true);
    let finalMemo = memo;
    if (isMemoEncrypted) {
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(user.keys.memo, receiverMemoKey, `#${memo}`);
    }

    return await sendToken(
      user.keys.active,
      user.name,
      {
        symbol: currency,
        to: sanitizeUsername(to),
        quantity: sanitizeAmount(amount),
        memo: finalMemo,
      },
      options,
    );
  };

  const onSend = async (options: TransactionOptions) => {
    try {
      if (isMemoEncrypted && !user.keys.memo)
        return showModal(
          translate('toast.missing_memo_key', {account: user.name!}),
          MessageModalType.ERROR,
        );
      if (!engine) {
        await sendTransfer(options);
        if (options.multisig) return;
        showModal(
          isRecurrent
            ? 'toast.recurrent_transfer_success'
            : 'toast.transfer_success',
          MessageModalType.SUCCESS,
        );
      } else {
        const {id, tx_id} = await transferToken(options);
        const {confirmed} = await tryConfirmTransaction(id || tx_id);
        if (options.multisig) return;
        showModal(
          confirmed
            ? 'toast.transfer_token_confirmed'
            : 'toast.transfer_token_unconfirmed',
          MessageModalType.SUCCESS,
        );
      }
    } catch (e) {
      showModal(
        beautifyTransferError(e as any, {
          to,
          currency,
          username: user.account.name,
        }),
        MessageModalType.ERROR,
        undefined,
        true,
      );
    }
  };
  const onTransferConfirmation = () => {
    if (toggleIndex === 0) onSendConfirmation();
    else onReceiveConfirmation();
  };

  const onReceiveConfirmation = () => {
    if (!amountReceive.length) {
      Toast.show(
        translate('wallet.operations.transfer.warning.missing_amount'),
      );
      return;
    }
    navigate('ReceiveTransfer', [
      'transfer',
      {
        to: user.name,
        amount: `${(+amountReceive).toFixed(3)} ${currency}`,
        memo: memoReceive,
      },
    ]);
  };

  const onSendConfirmation = () => {
    if (
      !amount.length ||
      !to.length ||
      (isRecurrent &&
        (exec.trim().length === 0 || recurrence.trim().length === 0))
    ) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(availableBalance)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      //TODO : Call confirmation page
      const confirmationData: ConfirmationPageProps = {
        title: 'wallet.operations.transfer.confirm.info',
        onSend,
        skipWarningTranslation: true,
        warningText: TransferUtils.getTransferWarningLabel(
          to,
          currency,
          memo,
          phishingAccounts,
          isRecurrent,
          false,
        ),
        data: [
          {
            title: 'wallet.operations.transfer.confirm.from',
            value: `@${user.account.name}`,
            tag: 'username',
          },
          {
            title: 'wallet.operations.transfer.confirm.to',
            value: `@${to}${ExchangesUtils.isExchange(to) ? '(exchange)' : ''}`,
            tag: 'username',
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: `${withCommas(amount)} ${currency}`,
          },
        ],
        keyType: KeyType.ACTIVE,
      };
      if (memo.length)
        confirmationData.data.push({
          title: 'wallet.operations.transfer.confirm.memo',
          value: `${
            memo.trim().length > 25 ? memo.substring(0, 22) + '...' : memo
          } ${isMemoEncrypted ? '(encrypted)' : ''}`,
        });
      if (isRecurrent)
        confirmationData.data.push(
          ...[
            {
              title: 'wallet.operations.transfer.confirm.recurrence',
              value: translate(
                'wallet.operations.transfer.confirm.recurrenceData',
                {
                  exec,
                  recurrence,
                },
              ),
            },
          ],
        );
      //TODO : put navigation screens in enum
      navigate('ConfirmationPage', confirmationData);
    }
  };
  const renderSend = () => (
    <View>
      <Separator height={35} />
      <OperationInput
        testID="username-input-testID"
        nativeID="username-input"
        autoCompleteValues={autocompleteFavoriteUsers}
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
          placeholder={translate('wallet.operations.transfer.memo')}
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
      {!engine && (
        <View>
          <Separator />
          <OptionsToggle
            theme={theme}
            title={translate('common.recurrent_transfer')}
            toggled={isRecurrent}
            additionalTitleStyle={getFormFontStyle(height, theme).title}
            callback={(toggled) => {
              setRecurrent(toggled);
            }}>
            <Separator />
            <OperationInput
              labelInput={translate('wallet.operations.transfer.frequency')}
              labelExtraInfo={translate(
                'wallet.operations.transfer.frequency_minimum',
              )}
              placeholder={translate('wallet.operations.transfer.frequency')}
              value={recurrence}
              onChangeText={setRecurrence}
              keyboardType={'number-pad'}
            />
            <Separator />
            <OperationInput
              labelInput={translate('wallet.operations.transfer.iterations')}
              labelExtraInfo={translate(
                'wallet.operations.transfer.iterations_minimum',
              )}
              placeholder={translate('wallet.operations.transfer.iterations')}
              value={exec}
              onChangeText={setExec}
              keyboardType={'number-pad'}
            />
          </OptionsToggle>
          <Separator />
        </View>
      )}
    </View>
  );

  const renderReceive = () => (
    <View>
      <Separator height={35} />
      <OperationInput
        testID="username-input-testID"
        nativeID="username-input"
        disabled
        autoCompleteValues={autocompleteFavoriteUsers}
        labelInput={translate('common.to')}
        leftIcon={<Icon name={Icons.AT} theme={theme} />}
        autoCapitalize="none"
        value={user.name}
      />
      <Separator />
      <View style={[styles.flexRowBetween, {zIndex: -1}]}>
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
          value={amountReceive}
          onChangeText={setAmountReceive}
          additionalOuterContainerStyle={{
            width: '54%',
          }}
        />
      </View>
      <Separator />
      <View style={{zIndex: -1}}>
        <OperationInput
          labelInput={capitalize(translate('common.memo'))}
          placeholder={translate('wallet.operations.transfer.memo')}
          value={memoReceive}
          trim={false}
          onChangeText={setMemoReceive}
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
              isHiveEngine={engine}
              setAvailableBalance={(available) =>
                setAvailableBalance(available)
              }
              theme={theme}
            />
            <Separator />
          </>
        }
        childrenMiddle={
          <ScreenToggle
            menu={[translate('common.send'), translate('common.receive')]}
            components={[renderSend(), renderReceive()]}
            toUpperCase={false}
            onIndexChanged={(i: number) => {
              setToggleIndex(i);
            }}
            theme={theme}
          />
        }
        buttonTitle={'common.next'}
        onNext={onTransferConfirmation}
        additionalContentContainerStyle={styles.paddingHorizontal}
        method={toggleIndex === 0 ? KeyTypes.active : 'none'}
      />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    warning: {color: 'red'},
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

export default connector(Transfer);
