import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import {Caption} from 'components/ui/Caption';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
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
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getFormFontStyle, title_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, getCleanAmountValue, toHP, withCommas} from 'utils/format';
import {powerUp} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {
  ConfirmationDataTag,
  ConfirmationPageProps,
  createBalanceData,
} from './Confirmation';
import OperationThemed from './OperationThemed';

export interface PowerUpOperationProps {
  currency?: string;
}

type Props = PropsFromRedux & PowerUpOperationProps;

const PowerUp = ({
  currency = 'HIVE',
  user,
  showModal,
  globalProperties,
}: Props) => {
  const [to, setTo] = useState(user.account.name);
  const [amount, setAmount] = useState('');

  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);
  const availableHiveAmount = getCurrencyProperties(currency, user.account)
    .value as string;

  const onPowerUp = async (options: TransactionOptions) => {
    try {
      await powerUp(
        user.keys.active!,
        {
          amount: sanitizeAmount(amount, currency),
          to: sanitizeUsername(to),
          from: user.account.name,
        },
        options,
      );
      if (options.multisig) return;

      showModal('toast.powerup_success', MessageModalType.SUCCESS);
    } catch (e) {
      showModal(
        `Error: ${(e as any).message}`,
        MessageModalType.ERROR,
        null,
        true,
      );
    }
  };

  const onPowerUpConfirmation = () => {
    if (!to || !amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(availableHiveAmount)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onPowerUp,
        keyType: KeyType.ACTIVE,
        title: 'wallet.operations.powerup.confirm.info',
        data: [
          {
            title: 'wallet.operations.transfer.confirm.from',
            value: `@${user.account.name}`,
            tag: ConfirmationDataTag.USERNAME,
          },
          {
            title: 'wallet.operations.transfer.confirm.to',
            value: `@${to}`,
            tag: ConfirmationDataTag.USERNAME,
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: withCommas(amount),
            tag: ConfirmationDataTag.AMOUNT,
            currency: currency,
          },
          createBalanceData(
            'wallet.operations.powerup.confirm.balance',
            parseFloat(availableHiveAmount),
            parseFloat(amount),
            currency,
          ),
        ],
      };
      navigate('ConfirmationPage', confirmationData);
    }
  };

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            height={height}
            currentValue={`${withCommas(
              toHP(user.account.vesting_shares + '', globalProperties).toFixed(
                3,
              ),
            )} HP`}
            availableValue={availableHiveAmount}
            additionalContainerStyle={styles.currentAvailableBalances}
          />
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <View style={{flex: 1}}>
          <Caption text="wallet.operations.powerup.info_text" />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name={Icons.AT} />}
            value={to}
            onChangeText={(e) => {
              setTo(e.trim());
            }}
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
                      setAmount(getCleanAmountValue(availableHiveAmount))
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
        </View>
      }
      buttonTitle={'wallet.operations.powerup.title'}
      onNext={onPowerUpConfirmation}
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    button: {marginBottom: 20},
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    infoText: {
      marginLeft: 15,
      opacity: 0.6,
    },
    text: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
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
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      globalProperties: state.properties.globals,
    };
  },
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PowerUp);
