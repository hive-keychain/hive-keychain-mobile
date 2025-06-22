import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import {Caption} from 'components/ui/Caption';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
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
import {MessageModalType} from 'src/enums/messageModal.enums';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {FontJosefineSansName, getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {
  capitalize,
  fromHP,
  getCleanAmountValue,
  toHP,
  withCommas,
} from 'utils/format';
import {getCurrency, powerDown} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {ConfirmationDataTag, ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export interface PowerDownOperationProps {
  currency?: string;
}

type Props = PropsFromRedux & PowerDownOperationProps;
const PowerDown = ({
  currency = 'HP',
  user,
  showModal,
  properties,
  delegations,
}: Props) => {
  const [amount, setAmount] = useState('');
  const [current, setCurrent] = useState<string | number>('...');
  const [available, setAvailable] = useState<string | number>('...');

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

  const onPowerDown = async (options: TransactionOptions) => {
    try {
      const amt = amount.length ? amount : '0';
      await powerDown(
        user.keys.active!,
        {
          vesting_shares: sanitizeAmount(
            fromHP(sanitizeAmount(amt), properties.globals!).toString(),
            'VESTS',
            6,
          ),
          account: user.account.name,
        },
        options,
      );
      if (options.multisig) return;

      if (parseFloat(amt.replace(',', '.')) !== 0) {
        showModal('toast.powerdown_success', MessageModalType.SUCCESS);
      } else {
        showModal('toast.stop_powerdown_success', MessageModalType.SUCCESS);
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

  const onPowerDownConfirmation = (isCancel = false) => {
    if (!isCancel && !amount) {
      Toast.show(translate('wallet.operations.convert.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(available + '')) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onPowerDown,
        keyType: KeyType.ACTIVE,
        title: `wallet.operations.powerdown.confirm.info${
          isCancel ? '_stop' : ''
        }`,
        data: isCancel
          ? [
              {
                title: 'common.account',
                value: `@${user.name}`,
                tag: ConfirmationDataTag.USERNAME,
              },
            ]
          : [
              {
                title: 'common.account',
                value: `@${user.name}`,
                tag: ConfirmationDataTag.USERNAME,
              },
              {
                title: 'wallet.operations.transfer.confirm.amount',
                value: withCommas(amount),
                tag: ConfirmationDataTag.AMOUNT,
                currency: currency,
              },
            ],
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
      additionalContentContainerStyle={{paddingHorizontal: 20}}
      additionalBgSvgImageStyle={{
        top: -40,
      }}
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
                  onPress={() => {
                    onPowerDownConfirmation(true);
                  }}
                />
              </View>
            </View>
          )}
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <View>
          <Caption text="wallet.operations.powerdown.powerdown_text" />
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
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0'}
              keyboardType="decimal-pad"
              textAlign="right"
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
                    onPress={() =>
                      setAmount(getCleanAmountValue(available.toString()))
                    }>
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
        </View>
      }
      buttonTitle={`wallet.operations.powerdown.title`}
      onNext={onPowerDownConfirmation}
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
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PowerDown);
