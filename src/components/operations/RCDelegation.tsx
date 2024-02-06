import {loadAccount} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {RCDelegationValue} from 'src/interfaces/rc-delegation.interface';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {BACKGROUNDDARKBLUE, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  FontJosefineSansName,
  FontPoppinsName,
  button_link_primary_medium,
  getFormFontStyle,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';
import IncomingOutGoingRCDelegations from './IncomingOutGoingRCDelegations';
import OperationThemed from './OperationThemed';

export interface RCDelegationOperationProps {
  //TODO fill when needed.
}

const DEFAULT_VALUE: RCDelegationValue = {
  hpValue: '...',
  gigaRcValue: '...',
};

const RCDelegation = ({
  loadAccount,
  properties,
  user,
}: RCDelegationOperationProps & PropsFromRedux) => {
  const [totalIncoming, setTotalIncoming] = useState<RCDelegationValue>(
    DEFAULT_VALUE,
  );
  const [totalOutgoing, setTotalOutgoing] = useState<RCDelegationValue>(
    DEFAULT_VALUE,
  );
  const [available, setAvailable] = useState<RCDelegationValue>(DEFAULT_VALUE);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const [amount, setAmount] = useState('');
  const [equivalentHPAmount, setEquivalentHPAmount] = useState<
    string | undefined
  >();
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    init();
  }, [user.name!]);

  useEffect(() => {
    if (amount.trim().length > 0 && parseFloat(amount) > 0) {
      setEquivalentHPAmount(
        withCommas(RcDelegationsUtils.gigaRcToHp(amount, properties)),
      );
    } else if (parseFloat(amount) === 0) {
      setEquivalentHPAmount(undefined);
      setIsCancel(true);
    }
  }, [amount]);

  const init = async () => {
    setTotalIncoming({
      hpValue: RcDelegationsUtils.rcToHp(
        user.rc.received_delegated_rc.toString(),
        properties,
      ),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(user.rc.received_delegated_rc),
    });
    setTotalOutgoing({
      hpValue: RcDelegationsUtils.rcToHp(
        user.rc.delegated_rc.toString(),
        properties,
      ),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(user.rc.delegated_rc),
    });
    const availableRc = (user.rc.max_rc * user.rc.percentage) / 100;

    setAvailable({
      hpValue: RcDelegationsUtils.rcToHp(availableRc.toString(), properties),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(availableRc),
    });
  };

  const setToPresetValue = (value: number) => {
    return {
      gigaRcValue: RcDelegationsUtils.hpToGigaRc(value.toString(), properties),
      hpValue: value.toFixed(3),
    };
  };

  const onHandlePreset = (value: number) => {
    setAmount(setToPresetValue(value).gigaRcValue);
  };

  const onHandleNavigateToRCDelegations = (type: 'incoming' | 'outgoing') => {
    if (type === 'incoming') return;
    navigate('TemplateStack', {
      titleScreen: capitalize(type),
      component: (
        <IncomingOutGoingRCDelegations
          type={type}
          total={totalOutgoing}
          available={available}
        />
      ),
    } as TemplateStackProps);
  };

  const handleConfirmation = () => {
    setStep(2);
  };

  const onRCDelegate = async () => {
    if (
      amount.trim().length === 0 ||
      parseFloat(amount) < 0 ||
      to.trim().length === 0
    ) {
      return SimpleToast.show(
        translate(
          'wallet.operations.rc_delegation.warning.no_username_or_amount',
        ),
        SimpleToast.LONG,
      );
    }

    try {
      setLoading(true);
      let success: any;

      success = await RcDelegationsUtils.sendDelegation(
        RcDelegationsUtils.gigaRcToRc(parseFloat(amount)),
        to,
        user.name!,
        user.keys.posting!,
      );

      if (success) {
        loadAccount(user.name!);
        goBack();
        if (!isCancel) {
          SimpleToast.show(
            translate(
              'wallet.operations.rc_delegation.success.rc_delegation_successful',
              {to},
            ),
            SimpleToast.LONG,
          );
        } else {
          SimpleToast.show(
            translate(
              'wallet.operations.rc_delegation.success.cancel_rc_delegation_successful',
              {to},
            ),
            SimpleToast.LONG,
          );
        }
      } else {
        SimpleToast.show(
          translate(
            'wallet.operations.rc_delegation.failed.rc_delegation_failed',
          ),
          SimpleToast.LONG,
        );
      }
    } catch (error) {
      SimpleToast.show(`Error : ${(error as any).message}`, SimpleToast.LONG);
    } finally {
      setLoading(false);
    }
  };

  return step === 1 ? (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            height={height}
            currentValue={`+${RcDelegationsUtils.formatRcWithUnit(
              totalIncoming.gigaRcValue,
              true,
            )}`}
            availableValue={`-${RcDelegationsUtils.formatRcWithUnit(
              totalOutgoing.gigaRcValue,
              true,
            )}`}
            additionalContainerStyle={styles.currentAvailableBalances}
            leftLabelTranslationKey="wallet.operations.rc_delegation.total_incoming"
            rightLabelTranslationKey="wallet.operations.rc_delegation.total_outgoing"
            onleftClick={() => onHandleNavigateToRCDelegations('incoming')}
            onRightClick={() => onHandleNavigateToRCDelegations('outgoing')}
          />
          <Separator />
          <TouchableOpacity
            onPress={() => setAmount(available.gigaRcValue)}
            style={[
              getCardStyle(theme, 30).defaultCardItem,
              styles.marginPadding,
            ]}>
            <View>
              <Text
                style={[
                  getFormFontStyle(height, theme).smallLabel,
                  styles.josefineFont,
                  styles.opaque,
                ]}>
                {capitalize(translate(`common.available`))}
              </Text>
              <Text
                style={[
                  getFormFontStyle(height, theme).input,
                  styles.josefineFont,
                ]}>
                {`${withCommas(available.gigaRcValue)} ${translate(
                  'wallet.operations.rc_delegation.giga_rc',
                )}`}
              </Text>
            </View>
          </TouchableOpacity>
          <Separator />
        </>
      }
      childrenMiddle={
        <>
          <Separator height={30} />
          <Text
            style={[
              getFormFontStyle(height, theme).title,
              styles.opaque,
              styles.disclaimer,
            ]}>
            {translate('wallet.operations.rc_delegation.disclaimer')}
          </Text>
          <Separator />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name={Icons.AT} />}
            inputStyle={[
              getFormFontStyle(height, theme).input,
              styles.paddingLeft,
            ]}
            additionalLabelStyle={getFormFontStyle(height, theme).title}
            value={to}
            onChangeText={(e) => {
              setTo(e.trim());
            }}
          />
          <Separator />
          <View style={styles.flexRow}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={translate('wallet.operations.rc_delegation.giga_rc')}
              value={translate('wallet.operations.rc_delegation.giga_rc')}
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
              labelBottomExtraInfo={
                equivalentHPAmount
                  ? `(≈ ${equivalentHPAmount} ${getCurrency('HP')})`
                  : undefined
              }
              placeholder={'0.000'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={amount}
              inputStyle={[
                getFormFontStyle(height, theme).input,
                styles.paddingLeft,
              ]}
              additionalLabelStyle={getFormFontStyle(height, theme).title}
              additionalBottomLabelTextStyle={[
                getFormFontStyle(height, theme, PRIMARY_RED_COLOR).smallLabel,
                styles.italic,
                styles.textRight,
              ]}
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
                    onPress={() => setAmount(available.gigaRcValue)}>
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
          <View style={[styles.flexWrap, styles.marginBottom]}>
            {[5, 10, 50, 100].map((value) => {
              return (
                <TouchableOpacity
                  onPress={() => onHandlePreset(value)}
                  key={`preset-rc-delegation-${value}`}
                  style={[getCardStyle(theme).roundedCardItem, styles.button]}>
                  <Text
                    style={
                      getFormFontStyle(height, theme).smallLabel
                    }>{`${value.toString()} ${getCurrency('HP')}`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      }
      childrenBottom={
        <>
          <ActiveOperationButton
            method={KeyTypes.posting}
            title={translate(
              'wallet.operations.rc_delegation.delegate_to_user',
            )}
            onPress={handleConfirmation}
            style={[getButtonStyle(theme).warningStyleButton]}
            isLoading={loading}
            additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
          />
          <Separator height={15} />
        </>
      }
    />
  ) : (
    <OperationThemed
      childrenTop={
        <>
          <Separator height={40} />
        </>
      }
      childrenMiddle={
        <>
          <Separator height={25} />
          <Text
            style={[
              getFormFontStyle(height, theme).title,
              styles.textCentered,
            ]}>
            {translate(
              `wallet.operations.rc_delegation.${
                isCancel ? 'confirmation_cancel' : 'confirmation'
              }`,
            )}
          </Text>
          <Separator height={25} />
          <View
            style={[getCardStyle(theme).defaultCardItem, styles.marginPadding]}>
            <View style={styles.flexRow}>
              <Text style={[getFormFontStyle(height, theme).title]}>
                {translate('common.to')}
              </Text>
              <Text
                style={[
                  getFormFontStyle(height, theme).title,
                  styles.opaque,
                ]}>{`@${to}`}</Text>
            </View>
            <View style={styles.flexRow}>
              <Text style={[getFormFontStyle(height, theme).title]}>
                {translate('common.value')}
              </Text>
              <Text
                style={[
                  getFormFontStyle(height, theme).title,
                  styles.opaque,
                ]}>{`${amount} ${translate(
                'wallet.operations.rc_delegation.giga_rc',
              )} (≈ ${
                equivalentHPAmount ? equivalentHPAmount : '0'
              } ${getCurrency('HP')})`}</Text>
            </View>
          </View>
        </>
      }
      childrenBottom={
        <View style={styles.operationButtonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            onPress={() => setStep(1)}
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
            onPress={onRCDelegate}
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    marginPadding: {marginHorizontal: 15, paddingVertical: 10},
    opaque: {
      opacity: 0.7,
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    disclaimer: {
      paddingHorizontal: 8,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    paddingLeft: {
      paddingLeft: 10,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    flexRow: {flexDirection: 'row', justifyContent: 'space-between'},
    flexWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {width: 60, justifyContent: 'center', alignItems: 'center'},
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
    textCentered: {textAlign: 'center'},
    textRight: {textAlign: 'right', marginRight: 10, marginTop: 5},
    marginBottom: {marginBottom: 10},
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RCDelegation);
