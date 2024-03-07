import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
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
import {default as Toast} from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {RCDelegationValue} from 'src/interfaces/rc-delegation.interface';
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
import {capitalize, formatBalanceCurrency, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';
import {ConfirmationPageProps} from './Confirmation';
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
  properties,
  user,
  showModal,
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

  const onRCDelegateConfirmation = () => {
    if (!to || !amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > parseFloat(available.gigaRcValue as string)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency: 'RC',
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onRCDelegate,
        title: 'wallet.operations.rc_delegation.confirm.info',
        data: [
          {
            title: 'wallet.operations.transfer.confirm.from',
            value: `@${user.account.name}`,
          },
          {
            value: `@${to}`,
            title: 'wallet.operations.transfer.confirm.to',
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: `${amount} GRC`,
          },
        ],
      };
      navigate('ConfirmationPage', confirmationData);
    }
  };

  const onRCDelegate = async () => {
    try {
      let success: any;

      success = await RcDelegationsUtils.sendDelegation(
        RcDelegationsUtils.gigaRcToRc(parseFloat(amount)),
        to,
        user.name!,
        user.keys.posting!,
      );

      if (success) {
        if (!isCancel) {
          showModal(
            'wallet.operations.rc_delegation.success.rc_delegation_successful',
            MessageModalType.SUCCESS,
            {to},
          );
        } else {
          showModal(
            'wallet.operations.rc_delegation.success.cancel_rc_delegation_successful',
            MessageModalType.SUCCESS,
            {to},
          );
        }
      } else {
        showModal(
          'wallet.operations.rc_delegation.failed.rc_delegation_failed',
          MessageModalType.ERROR,
        );
      }
    } catch (error) {
      showModal(
        `Error : ${(error as any).message}`,
        MessageModalType.ERROR,
        null,
        true,
      );
    }
  };

  return (
    <OperationThemed
      additionalBgSvgImageStyle={{
        top: -40,
      }}
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
        <View>
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
              labelExtraInfo={
                equivalentHPAmount
                  ? `≈ ${formatBalanceCurrency(
                      equivalentHPAmount,
                    )} ${getCurrency('HP')}`
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
          <View style={[styles.delegationValuesButtons]}>
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
        </View>
      }
      method={KeyTypes.posting}
      buttonTitle={'wallet.operations.rc_delegation.delegate_to_user'}
      onNext={onRCDelegateConfirmation}
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
    delegationValuesButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'space-evenly',
      marginVertical: 24,
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
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RCDelegation);
