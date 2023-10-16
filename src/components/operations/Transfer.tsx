import {loadAccount} from 'actions/index';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import {encodeMemo} from 'components/bridge';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import OptionsToggle from 'components/ui/OptionsToggle';
import Separator from 'components/ui/Separator';
import React, {useContext, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  beautifyTransferError,
  capitalize,
  capitalizeSentence,
} from 'utils/format';
import {recurrentTransfer, sendToken, transfer} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {
  getAccountKeys,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import {getTransferWarning} from 'utils/transferValidator';
import Balance from './Balance';
import Operation from './Operation';

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
  loadAccount,
  engine,
  tokenBalance,
  tokenLogo,
  phishingAccounts,
}: Props) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [exec, setExec] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isRecurrent, setRecurrent] = useState(false);
  const [isMemoEncrypted, setIsMemoEncrypted] = useState<boolean>(false);
  const {theme} = useContext(ThemeContext);

  const sendTransfer = async () => {
    setLoading(true);
    let finalMemo = memo;
    if (isMemoEncrypted) {
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(user.keys.memo, receiverMemoKey, `#${memo}`);
    }
    if (!isRecurrent) {
      await transfer(user.keys.active, {
        amount: sanitizeAmount(amount, currency),
        memo: finalMemo,
        to: sanitizeUsername(to),
        from: user.account.name,
      });
    } else {
      await recurrentTransfer(user.keys.active, {
        amount: sanitizeAmount(amount, currency),
        memo: finalMemo,
        to: sanitizeUsername(to),
        from: user.account.name,
        recurrence: +recurrence,
        executions: +exec,
        extensions: [],
      });
    }
  };

  const transferToken = async () => {
    setLoading(true);

    return await sendToken(user.keys.active, user.name, {
      symbol: currency,
      to: sanitizeUsername(to),
      quantity: sanitizeAmount(amount),
      memo: memo,
    });
  };

  const onSend = async () => {
    Keyboard.dismiss();
    try {
      if (!engine) {
        await sendTransfer();
        Toast.show(
          translate(
            isRecurrent
              ? 'toast.recurrent_transfer_success'
              : 'toast.transfer_success',
          ),
          Toast.LONG,
        );
      } else {
        const {id} = await transferToken();
        const {confirmed} = await tryConfirmTransaction(id);
        Toast.show(
          confirmed
            ? translate('toast.transfer_token_confirmed')
            : translate('toast.transfer_token_unconfirmed'),
          Toast.LONG,
        );
      }
      loadAccount(user.account.name, true);
      goBack();
    } catch (e) {
      Toast.show(
        beautifyTransferError(e as any, {
          to,
          currency,
          username: user.account.name,
        }),
        Toast.LONG,
      );
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(color, height, theme);
  if (step === 1) {
    return (
      <Background
        using_new_ui
        theme={theme}
        additionalBgSvgImageStyle={styles.backgroundSvgImage}>
        <>
          <FocusAwareStatusBar />
          <Separator />
          <Balance
            currency={currency}
            account={user.account}
            tokenBalance={tokenBalance}
            tokenLogo={tokenLogo}
            isHiveEngine={engine}
            setMax={(value: string) => {
              setAmount(value);
            }}
            using_new_ui
            theme={theme}
          />
          <Separator />
          <View style={styles.innerContainer}>
            <ScrollView>
              <Separator height={35} />
              <OperationInput
                labelInput={translate('common.username')}
                placeholder={translate('common.username')}
                leftIcon={<Icon name="at" theme={theme} />}
                autoCapitalize="none"
                value={to}
                onChangeText={(e) => {
                  setTo(e.trim());
                }}
                inputStyle={styles.text}
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
                  inputStyle={styles.text}
                  additionalInputContainerStyle={{
                    marginHorizontal: 0,
                  }}
                />
                <OperationInput
                  labelInput={capitalize(translate('common.amount'))}
                  placeholder={capitalizeSentence(
                    translate('common.enter_amount'),
                  )}
                  value={amount}
                  onChangeText={setAmount}
                  additionalInputContainerStyle={{
                    marginHorizontal: 0,
                  }}
                  additionalOuterContainerStyle={{
                    width: '54%',
                  }}
                  inputStyle={styles.text}
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
                      <TouchableOpacity onPress={() => setAmount(tokenBalance)}>
                        <Text style={styles.text}>
                          {translate('common.max').toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  }
                />
              </View>
              <Separator />
              <OperationInput
                labelInput={capitalize(translate('common.memo'))}
                placeholder={translate('wallet.operations.transfer.memo')}
                value={memo}
                onChangeText={setMemo}
                inputStyle={styles.text}
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
                    <Icon
                      name={isMemoEncrypted ? 'encrypt' : 'decrypt'}
                      theme={theme}
                      onClick={() => setIsMemoEncrypted(!isMemoEncrypted)}
                    />
                  </View>
                }
              />
              <Separator />
              <OptionsToggle
                theme={theme}
                title={translate('common.recurrent_transfer')}
                toggled={isRecurrent}
                callback={(toggled) => {
                  setRecurrent(toggled);
                }}>
                <Separator />
                <OperationInput
                  labelInput={translate('wallet.operations.transfer.frecuency')}
                  labelExtraInfo={capitalizeSentence(
                    translate('wallet.operations.transfer.frecuency_minimum'),
                  )}
                  placeholder={translate(
                    'wallet.operations.transfer.frecuency',
                  )}
                  value={recurrence}
                  onChangeText={setRecurrence}
                  keyboardType={'number-pad'}
                />
                <Separator />
                <OperationInput
                  labelInput={translate(
                    'wallet.operations.transfer.iterations',
                  )}
                  labelExtraInfo={capitalizeSentence(
                    translate('wallet.operations.transfer.iterations_minimum'),
                  )}
                  placeholder={translate(
                    'wallet.operations.transfer.iterations',
                  )}
                  value={exec}
                  onChangeText={setExec}
                  keyboardType={'number-pad'}
                />
              </OptionsToggle>
              <Separator />
            </ScrollView>
            <View style={styles.operationButtonsContainer}>
              <EllipticButton
                title={translate('common.send')}
                onPress={() => {
                  if (!amount.length || !to.length) {
                    Toast.show(
                      translate(
                        'wallet.operations.transfer.warning.missing_info',
                      ),
                    );
                  } else {
                    setStep(2);
                  }
                }}
                //TODO important need testing in IOS
                style={getButtonStyle(theme).warningStyleButton}
                additionalTextStyle={{...button_link_primary_medium}}
              />
            </View>
          </View>
        </>
      </Background>
    );
  } else {
    //TODO work in the step 2 trying to reuse
    return (
      <Operation
        theme={theme}
        logo={<SendArrowBlue />}
        title={translate('wallet.operations.transfer.title')}>
        <ScrollView>
          <Separator height={30} />
          <Text style={styles.warning}>
            {
              getTransferWarning(phishingAccounts, to, currency, !!memo, memo)
                .warning
            }
          </Text>
          <Separator />
          <Text style={styles.title}>
            {translate('wallet.operations.transfer.confirm.from')}
          </Text>
          <Text>{`@${user.account.name}`}</Text>
          <Separator />
          <Text style={styles.title}>
            {translate('wallet.operations.transfer.confirm.to')}
          </Text>
          <Text>{`@${to} ${
            getTransferWarning(phishingAccounts, to, currency, !!memo, memo)
              .exchange
              ? '(exchange)'
              : ''
          }`}</Text>
          <Separator />
          <Text style={styles.title}>
            {translate('wallet.operations.transfer.confirm.amount')}
          </Text>
          <Text>{`${amount} ${currency}`}</Text>

          {memo.length ? (
            <>
              <Separator />
              <Text style={styles.title}>
                {translate('wallet.operations.transfer.confirm.memo')}
              </Text>
              <Text>{`${memo} ${isMemoEncrypted ? '(encrypted)' : ''}`}</Text>
            </>
          ) : null}
          <Separator />
          {isRecurrent ? (
            <>
              <Text style={styles.title}>
                {translate('wallet.operations.transfer.confirm.recurrence')}
              </Text>
              <Text>
                {translate(
                  'wallet.operations.transfer.confirm.recurrenceData',
                  {exec, recurrence},
                )}
              </Text>
            </>
          ) : null}
          <Separator height={40} />
          <View style={styles.buttonsContainer}>
            <EllipticButton
              title={translate('common.back')}
              style={styles.back}
              onPress={() => {
                setStep(1);
              }}
            />
            <ActiveOperationButton
              title={translate('common.confirm')}
              onPress={onSend}
              style={styles.confirm}
              isLoading={loading}
            />
          </View>
        </ScrollView>
      </Operation>
    );
  }
};

const getDimensionedStyles = (color: string, width: number, theme: Theme) =>
  StyleSheet.create({
    send: {
      backgroundColor: '#68A0B4',
      width: '90%',
    },
    confirm: {
      backgroundColor: '#68A0B4',
      width: width / 5,
      marginHorizontal: 0,
    },
    warning: {color: 'red', fontWeight: 'bold'},
    back: {backgroundColor: '#7E8C9A', width: width / 5, marginHorizontal: 0},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    title: {fontWeight: 'bold', fontSize: 16},
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    //TODO clean up, check & delete
    header: {
      paddingHorizontal: 16,
    },
    innerContainer: {
      flex: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorJustDark,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
    backgroundSvgImage: {
      top: 0,
      opacity: 0.9,
    },
    operationButtonsContainer: {alignItems: 'center', marginBottom: 20},
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
  });
const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Transfer);
