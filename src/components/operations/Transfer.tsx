import {loadAccount} from 'actions/index';
import {showModal} from 'actions/message';
import {encodeMemo} from 'components/bridge';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import OptionsToggle from 'components/ui/OptionsToggle';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonStyle} from 'src/styles/button';
import {BACKGROUNDDARKBLUE, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {beautifyTransferError, capitalize} from 'utils/format';
import {recurrentTransfer, sendToken, transfer} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {
  getAccountKeys,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';
import {getTransferWarning} from 'utils/transferValidator';
import Balance from './Balance';
import OperationThemed from './OperationThemed';

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
  showModal,
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
  const {theme} = useThemeContext();
  console.log({currency, tokenBalance}); //TODO remove line
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
        showModal(
          isRecurrent
            ? 'toast.recurrent_transfer_success'
            : 'toast.transfer_success',
          MessageModalType.SUCCESS,
        );
      } else {
        const {id} = await transferToken();
        const {confirmed} = await tryConfirmTransaction(id);
        showModal(
          confirmed
            ? 'toast.transfer_token_confirmed'
            : 'toast.transfer_token_unconfirmed',
          MessageModalType.SUCCESS,
        );
      }
      loadAccount(user.account.name, true);
      resetStackAndNavigate('WALLET');
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
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(color, height, theme);

  if (step === 1) {
    return (
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
              setMax={(value: string) => {
                setAmount(value);
              }}
              theme={theme}
            />
            <Separator />
          </>
        }
        childrenMiddle={
          <>
            <Separator height={35} />
            <OperationInput
              labelInput={translate('common.username')}
              placeholder={translate('common.username')}
              leftIcon={<Icon name={Icons.AT} theme={theme} />}
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
                keyboardType="decimal-pad"
                labelInput={capitalize(translate('common.amount'))}
                placeholder={translate('common.enter_amount')}
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
                    <TouchableOpacity
                      onPress={() => setAmount(tokenBalance.split(' ')[0])}>
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
                    name={isMemoEncrypted ? Icons.ENCRYPT : Icons.DECRYPT}
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
                labelExtraInfo={translate(
                  'wallet.operations.transfer.frecuency_minimum',
                )}
                placeholder={translate('wallet.operations.transfer.frecuency')}
                value={recurrence}
                onChangeText={setRecurrence}
                keyboardType={'number-pad'}
                inputStyle={styles.text}
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
                inputStyle={styles.text}
              />
            </OptionsToggle>
            <Separator />
          </>
        }
        childrenBottom={
          <View style={styles.operationButtonsContainer}>
            <EllipticButton
              title={translate('common.send')}
              onPress={() => {
                if (
                  !amount.length ||
                  !to.length ||
                  (isRecurrent &&
                    (exec.trim().length === 0 ||
                      recurrence.trim().length === 0))
                ) {
                  Toast.show(
                    translate(
                      'wallet.operations.transfer.warning.missing_info',
                    ),
                  );
                } else {
                  setStep(2);
                }
              }}
              style={getButtonStyle(theme).warningStyleButton}
              additionalTextStyle={{...button_link_primary_medium}}
            />
          </View>
        }
        additionalContentContainerStyle={styles.paddingHorizontal}
      />
    );
  } else {
    return (
      <OperationThemed
        childrenTop={<Separator height={50} />}
        childrenMiddle={
          <>
            <Separator height={35} />
            <Text style={[styles.text, styles.info]}>
              {translate('wallet.operations.transfer.confirm.info')}
            </Text>
            <Separator />
            <Text style={[styles.text, styles.warning]}>
              {
                getTransferWarning(phishingAccounts, to, currency, !!memo, memo)
                  .warning
              }
            </Text>
            <Separator />
            <View style={styles.justifyCenter}>
              <View style={[styles.flexRowBetween, styles.width95]}>
                <Text style={[styles.text, styles.title]}>
                  {translate('wallet.operations.transfer.confirm.from')}
                </Text>
                <Text
                  style={[
                    styles.text,
                    styles.textContent,
                  ]}>{`@${user.account.name}`}</Text>
              </View>
              <Separator
                drawLine
                height={0.5}
                additionalLineStyle={styles.bottomLine}
              />
            </View>
            <Separator />
            <View style={styles.justifyCenter}>
              <View style={[styles.flexRowBetween, styles.width95]}>
                <Text style={[styles.text, styles.title]}>
                  {translate('wallet.operations.transfer.confirm.to')}
                </Text>
                <Text style={[styles.text, styles.textContent]}>{`@${to} ${
                  getTransferWarning(
                    phishingAccounts,
                    to,
                    currency,
                    !!memo,
                    memo,
                  ).exchange
                    ? '(exchange)'
                    : ''
                }`}</Text>
              </View>
              <Separator
                drawLine
                height={0.5}
                additionalLineStyle={styles.bottomLine}
              />
            </View>
            <Separator />
            <View style={styles.justifyCenter}>
              <View style={[styles.flexRowBetween, styles.width95]}>
                <Text style={[styles.text, styles.title]}>
                  {translate('wallet.operations.transfer.confirm.amount')}
                </Text>
                <Text
                  style={[
                    styles.text,
                    styles.textContent,
                  ]}>{`${amount} ${currency}`}</Text>
              </View>
              <Separator
                drawLine
                height={0.5}
                additionalLineStyle={styles.bottomLine}
              />
            </View>
            {memo.length ? (
              <>
                <Separator />
                <View style={styles.justifyCenter}>
                  <View style={[styles.flexRowBetween, styles.width95]}>
                    <Text style={[styles.text, styles.title]}>
                      {translate('wallet.operations.transfer.confirm.memo')}
                    </Text>
                    <Text style={[styles.text, styles.textContent]}>{`${memo} ${
                      isMemoEncrypted ? '(encrypted)' : ''
                    }`}</Text>
                  </View>
                  <Separator
                    drawLine
                    height={0.5}
                    additionalLineStyle={styles.bottomLine}
                  />
                </View>
              </>
            ) : null}
            <Separator />
            {isRecurrent ? (
              <>
                <View style={styles.justifyCenter}>
                  <View style={[styles.flexRowBetween, styles.width95]}>
                    <Text style={[styles.text, styles.title]}>
                      {translate(
                        'wallet.operations.transfer.confirm.recurrence',
                      )}
                    </Text>
                    <Text style={[styles.text, styles.textContent]}>
                      {translate(
                        'wallet.operations.transfer.confirm.recurrenceData',
                        {
                          exec,
                          recurrence,
                        },
                      )}
                    </Text>
                  </View>
                  <Separator
                    drawLine
                    height={0.5}
                    additionalLineStyle={styles.bottomLine}
                  />
                </View>
              </>
            ) : null}
          </>
        }
        childrenBottom={
          <View style={styles.operationButtonsContainer}>
            <EllipticButton
              title={translate('common.back')}
              onPress={() => setStep(1)}
              style={[
                styles.operationButton,
                styles.operationButtonConfirmation,
              ]}
              additionalTextStyle={[
                styles.operationButtonText,
                styles.buttonTextColorDark,
              ]}
            />
            <ActiveOperationButton
              title={translate('common.confirm')}
              onPress={onSend}
              style={[
                styles.operationButton,
                getButtonStyle(theme).warningStyleButton,
              ]}
              additionalTextStyle={styles.operationButtonText}
              isLoading={loading}
            />
          </View>
        }
        additionalContentContainerStyle={styles.paddingHorizontal}
      />
    );
  }
};

const getDimensionedStyles = (color: string, width: number, theme: Theme) =>
  StyleSheet.create({
    warning: {color: 'red'},
    title: {fontSize: 16},
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
    info: {
      fontSize: 15,
      opacity: 0.7,
    },
    textContent: {
      fontSize: 14,
      color: getColors(theme).senaryText,
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    width95: {
      width: '95%',
    },
    justifyCenter: {justifyContent: 'center', alignItems: 'center'},
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
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
    buttonTextColor: {
      color: getColors(theme).secondaryText,
    },
    modalContainer: {
      width: '100%',
      alignSelf: 'flex-end',
      backgroundColor: getColors(theme).cardBgColor,
      borderWidth: 0,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    },
    paddingHorizontal: {
      paddingHorizontal: 18,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {loadAccount, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Transfer);
