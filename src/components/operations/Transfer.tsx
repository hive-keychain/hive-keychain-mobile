import {loadAccount} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import {encodeMemo} from 'components/bridge';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import OptionsToggle from 'components/ui/OptionsToggle';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
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
import {AutoCompleteValues} from 'src/interfaces/autocomplete.interface';
import {getButtonHeight, getButtonStyle} from 'src/styles/button';
import {
  BACKGROUNDDARKBLUE,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {FavoriteUserUtils} from 'utils/favorite-user.utils';
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
  localAccounts,
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
  const [autocompleteFavoriteUsers, setAutocompleteFavoriteUsers] = useState<
    AutoCompleteValues
  >({
    categories: [],
  });
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
      await FavoriteUserUtils.saveFavoriteUser(to, user);
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

  const onhandleSetMaxAvailableBalance = () => {
    let availableBalance;
    if (engine) {
      availableBalance = tokenBalance.split(' ')[0];
    } else {
      availableBalance = getCurrencyProperties(currency, user.account).value;
    }
    setAmount((availableBalance as string).split(' ')[0]);
  };

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
              autoCompleteValues={autocompleteFavoriteUsers}
              labelInput={translate('common.to')}
              placeholder={translate('common.username')}
              leftIcon={<Icon name={Icons.AT} theme={theme} />}
              autoCapitalize="none"
              value={to}
              onChangeText={(e) => {
                setTo(e.trim());
              }}
              inputStyle={getFormFontStyle(height, theme).input}
              additionalLabelStyle={getFormFontStyle(height, theme).labelInput}
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
                additionalInputContainerStyle={{
                  marginHorizontal: 0,
                }}
                inputStyle={getFormFontStyle(height, theme).input}
                additionalLabelStyle={
                  getFormFontStyle(height, theme).labelInput
                }
              />
              <OperationInput
                keyboardType="decimal-pad"
                labelInput={capitalize(translate('common.amount'))}
                placeholder={'0'}
                value={amount}
                onChangeText={setAmount}
                additionalInputContainerStyle={{
                  marginHorizontal: 0,
                }}
                additionalOuterContainerStyle={{
                  width: '54%',
                }}
                inputStyle={getFormFontStyle(height, theme).input}
                additionalLabelStyle={
                  getFormFontStyle(height, theme).labelInput
                }
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
                    <TouchableOpacity onPress={onhandleSetMaxAvailableBalance}>
                      <Text
                        style={
                          getFormFontStyle(height, theme, PRIMARY_RED_COLOR)
                            .input
                        }>
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
              inputStyle={getFormFontStyle(height, theme).input}
              additionalLabelStyle={getFormFontStyle(height, theme).labelInput}
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
                    color={PRIMARY_RED_COLOR}
                  />
                </View>
              }
            />
            <Separator />
            <OptionsToggle
              type={'checkbox'}
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
                inputStyle={getFormFontStyle(height, theme).input}
                additionalLabelStyle={
                  getFormFontStyle(height, theme).labelInput
                }
                additionalLabelExtraInfoTextStyle={
                  getFormFontStyle(height, theme).infoLabel
                }
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
                inputStyle={getFormFontStyle(height, theme).input}
                additionalLabelStyle={
                  getFormFontStyle(height, theme).labelInput
                }
                additionalLabelExtraInfoTextStyle={
                  getFormFontStyle(height, theme).infoLabel
                }
              />
            </OptionsToggle>
            <Separator />
          </>
        }
        childrenBottom={
          <View style={styles.operationButtonsContainer}>
            <ActiveOperationButton
              method={KeyTypes.active}
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
              style={getButtonStyle(theme, height).warningStyleButton}
              additionalTextStyle={
                getFormFontStyle(height, theme, 'white').title
              }
              isLoading={false}
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
            <Text style={[getFormFontStyle(height, theme).title, styles.info]}>
              {translate('wallet.operations.transfer.confirm.info')}
            </Text>
            <Separator />
            <Text
              style={[
                getFormFontStyle(height, theme).infoLabel,
                styles.warning,
              ]}>
              {
                getTransferWarning(phishingAccounts, to, currency, !!memo, memo)
                  .warning
              }
            </Text>
            <Separator />
            <View style={styles.justifyCenter}>
              <View style={[styles.flexRowBetween, styles.width95]}>
                <Text style={[getFormFontStyle(height, theme).title]}>
                  {translate('wallet.operations.transfer.confirm.from')}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).title,
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
                <Text style={[getFormFontStyle(height, theme).title]}>
                  {translate('wallet.operations.transfer.confirm.to')}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).title,
                    styles.textContent,
                  ]}>{`@${to} ${
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
                <Text style={[getFormFontStyle(height, theme).title]}>
                  {translate('wallet.operations.transfer.confirm.amount')}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).title,
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
                    <Text style={[getFormFontStyle(height, theme).title]}>
                      {translate('wallet.operations.transfer.confirm.memo')}
                    </Text>
                    <Text
                      style={[
                        getFormFontStyle(height, theme).title,
                        styles.textContent,
                      ]}>{`${
                      memo.trim().length > 25
                        ? memo.substring(0, 22) + '...'
                        : memo
                    } ${isMemoEncrypted ? '(encrypted)' : ''}`}</Text>
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
                    <Text style={[getFormFontStyle(height, theme).title]}>
                      {translate(
                        'wallet.operations.transfer.confirm.recurrence',
                      )}
                    </Text>
                    <Text
                      style={[
                        getFormFontStyle(height, theme).title,
                        styles.textContent,
                      ]}>
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
                theme === Theme.LIGHT
                  ? {
                      borderWidth: 1,
                      borderColor: getColors(theme)
                        .secondaryLineSeparatorStroke,
                    }
                  : undefined,
              ]}
              additionalTextStyle={
                getFormFontStyle(height, theme, BACKGROUNDDARKBLUE).title
              }
            />
            <ActiveOperationButton
              title={translate('common.confirm')}
              onPress={onSend}
              style={[
                styles.operationButton,
                getButtonStyle(theme, height).warningStyleButton,
              ]}
              additionalTextStyle={
                getFormFontStyle(height, theme, 'white').title
              }
              isLoading={loading}
            />
          </View>
        }
        additionalContentContainerStyle={styles.paddingHorizontal}
      />
    );
  }
};

const getDimensionedStyles = (color: string, height: number, theme: Theme) =>
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
    textContent: {
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
      height: getButtonHeight(height),
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
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
      localAccounts: state.accounts,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {loadAccount, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Transfer);
