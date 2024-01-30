import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {
  BACKGROUNDDARKBLUE,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  FontJosefineSansName,
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
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
            theme={theme}
            currentValue={withCommas(current as string)}
            availableValue={withCommas(available as string)}
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
                      styles.textBase,
                      styles.josefineFont,
                      styles.opaque,
                    ]}>
                    {translate('wallet.operations.powerdown.powering_down')}
                  </Text>
                  <Text
                    style={[
                      styles.textBase,
                      styles.title,
                      styles.josefineFont,
                    ]}>
                    {poweringDown.total_withdrawing} {getCurrency('HP')}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.textBase,
                      styles.josefineFont,
                      styles.opaque,
                    ]}>
                    {translate('wallet.operations.powerdown.next_power_down')}
                  </Text>
                  <Text
                    style={[
                      styles.textBase,
                      styles.title,
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
          <Text style={[styles.textBase, styles.opaque]}>
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
              inputStyle={styles.textBase}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
            />
            <OperationInput
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0.000'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={amount}
              inputStyle={[styles.textBase, styles.paddingLeft]}
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
                    onPress={() => setAmount(available.toString())}>
                    <Text style={[styles.textBase, styles.redText]}>
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
            additionalTextStyle={{...button_link_primary_medium}}
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
              styles.textBase,
              styles.title,
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
                <Text style={[styles.textBase, styles.title]}>
                  {capitalize(translate('common.amount'))}
                </Text>
                <Text style={[styles.textBase, styles.opaque]}>{`${withCommas(
                  amount,
                )} ${getCurrency('HP')}`}</Text>
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
            style={[styles.operationButton, styles.operationButtonConfirmation]}
            additionalTextStyle={[
              styles.operationButtonText,
              styles.buttonTextColorDark,
            ]}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={onPowerDown}
            style={[
              styles.operationButton,
              getButtonStyle(theme).warningStyleButton,
            ]}
            additionalTextStyle={styles.operationButtonText}
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
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    title: {
      fontSize: 15,
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
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
    buttonTextColor: {
      color: getColors(theme).secondaryText,
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
