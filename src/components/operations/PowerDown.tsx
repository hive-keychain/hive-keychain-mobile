import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {BACKGROUNDDARKBLUE, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {FontJosefineSansName, getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {capitalize, fromHP, toHP, withCommas} from 'utils/format';
import {getCurrency, powerDown} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import OperationThemed from './OperationThemed';

export interface PowerDownOperationProps {
  currency?: string;
}

type Props = PropsFromRedux & PowerDownOperationProps;
const PowerDown = ({
  currency = 'HP',
  user,
  loadAccount,
  properties,
  delegations,
}: Props) => {
  const [amount, setAmount] = useState('0');
  const [current, setCurrent] = useState<string | number>('...');
  const [available, setAvailable] = useState<string | number>('...');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    const hiveBalance = Number((user.account.balance as string).split(' ')[0]);

    let totalOutgoingVestingShares = 0;
    for (const delegation of delegations.outgoing) {
      totalOutgoingVestingShares += parseFloat(
        delegation.vesting_shares.toString().split(' ')[0],
      );
    }

    const hpBalance = (
      toHP(
        (
          parseFloat(
            user.account.vesting_shares.toString().replace('VESTS', ''),
          ) - totalOutgoingVestingShares
        ).toString(),
        properties.globals,
      ) - 5
    ).toFixed(3);

    setAvailable(Math.max(Number(hpBalance), 0));
    setCurrent(hiveBalance);
  }, [user, delegations]);

  const poweringDown = AccountUtils.getPowerDown(
    user.account,
    properties.globals,
  );

  const onPowerDown = async () => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      await powerDown(user.keys.active!, {
        vesting_shares: sanitizeAmount(
          fromHP(sanitizeAmount(amount), properties.globals!).toString(),
          'VESTS',
          6,
        ),
        account: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        Toast.show(translate('toast.powerdown_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_powerdown_success'), Toast.LONG);
      }
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const onHandleCancelPowerDown = () => {
    setIsCancel(true);
    setAmount('0');
    setStep(2);
  };

  const onHandleBack = () => {
    setIsCancel(false);
    setAmount('0');
    setStep(1);
  };

  const onHandleConfirmStepOne = () => {
    if (
      parseFloat(amount) === 0 &&
      parseFloat(poweringDown.total_withdrawing) > 0
    ) {
      setIsCancel(true);
    }
    setStep(2);
  };

  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  return step === 1 ? (
    <OperationThemed
      additionalContentContainerStyle={{paddingHorizontal: 20}}
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            height={height}
            theme={theme}
            currentValue={`${withCommas(current as string)} ${getCurrency(
              'HIVE',
            )}`}
            availableValue={`${withCommas(available as string)} ${getCurrency(
              'HP',
            )}`}
            additionalContainerStyle={styles.currentAvailableBalances}
            setMaxAvailable={(value) => setAmount(value)}
          />
          <Separator />
          {parseFloat(poweringDown.total_withdrawing) > 0 && (
            <View
              style={[
                getCardStyle(theme, 30).defaultCardItem,
                styles.marginHorizontal,
              ]}>
              <View style={styles.flexRowBetween}>
                <View>
                  <Text
                    style={[
                      getFormFontStyle(height, theme).smallLabel,
                      styles.josefineFont,
                      styles.opaque,
                    ]}>
                    {translate('wallet.operations.powerdown.powering_down')}
                  </Text>
                  <Text
                    style={[
                      getFormFontStyle(height, theme).input,
                      styles.josefineFont,
                    ]}>
                    {poweringDown.total_withdrawing} {getCurrency('HP')}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      getFormFontStyle(height, theme).smallLabel,
                      styles.josefineFont,
                      styles.opaque,
                    ]}>
                    {translate('wallet.operations.powerdown.next_power_down')}
                  </Text>
                  <Text
                    style={[
                      getFormFontStyle(height, theme).input,
                      styles.josefineFont,
                    ]}>
                    {moment(poweringDown.next_vesting_withdrawal).format('L')}
                  </Text>
                </View>
                <Icon
                  theme={theme}
                  name={Icons.GIFT_DELETE}
                  onClick={onHandleCancelPowerDown}
                />
              </View>
            </View>
          )}
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <>
          <Separator height={25} />
          <Text
            style={[
              getFormFontStyle(height, theme).title,
              styles.currentAvailableBalances,
              styles.opaque,
            ]}>
            {translate('wallet.operations.powerdown.powerdown_text')}
          </Text>
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
              inputStyle={[
                getFormFontStyle(height, theme).input,
                styles.paddingLeft,
              ]}
              additionalLabelStyle={getFormFontStyle(height, theme).title}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
            />
            <OperationInput
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={amount}
              inputStyle={[
                getFormFontStyle(height, theme).input,
                styles.paddingLeft,
              ]}
              additionalLabelStyle={getFormFontStyle(height, theme).title}
              onChangeText={setAmount}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
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
                    onPress={() => setAmount(withCommas(available.toString()))}>
                    <Text
                      style={[
                        getFormFontStyle(height, theme, PRIMARY_RED_COLOR)
                          .input,
                      ]}>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </>
      }
      childrenBottom={
        <>
          <ActiveOperationButton
            title={translate(`wallet.operations.powerdown.title`)}
            onPress={onHandleConfirmStepOne}
            style={[getButtonStyle(theme).warningStyleButton]}
            isLoading={loading}
            additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
          />
          <Separator />
        </>
      }
    />
  ) : (
    <OperationThemed
      childrenTop={<Separator height={40} />}
      childrenMiddle={
        <>
          <Separator height={25} />
          <Text
            style={[
              getFormFontStyle(height, theme).title,
              styles.opaque,
              styles.textCentered,
            ]}>
            {translate(
              `wallet.operations.powerdown.${
                isCancel ? 'confirm_cancel' : 'confirm_power_down'
              }`,
            )}
          </Text>
          {!isCancel && (
            <>
              <Separator />
              <View
                style={[
                  getCardStyle(theme).defaultCardItem,
                  styles.marginHorizontal,
                  styles.flexRowBetween,
                ]}>
                <Text style={[getFormFontStyle(height, theme).title]}>
                  {capitalize(translate('common.amount'))}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).title,
                    styles.opaque,
                  ]}>{`${withCommas(amount)} ${getCurrency('HP')}`}</Text>
              </View>
            </>
          )}
        </>
      }
      childrenBottom={
        <View style={styles.operationButtonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            onPress={onHandleBack}
            style={[
              getButtonStyle(theme).outlineSoftBorder,
              styles.operationButton,
              styles.operationButtonConfirmation,
            ]}
            additionalTextStyle={[
              getFormFontStyle(height, theme, BACKGROUNDDARKBLUE).title,
            ]}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={onPowerDown}
            style={[
              styles.operationButton,
              getButtonStyle(theme).warningStyleButton,
            ]}
            additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
            isLoading={loading}
          />
        </View>
      }
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    opaque: {
      opacity: 0.7,
    },
    flexRowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    marginHorizontal: {marginHorizontal: 15},
    paddingLeft: {
      paddingLeft: 10,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
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
    textCentered: {textAlign: 'center'},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
      delegations: state.delegations,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PowerDown);
