import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
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
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  getFontSizeSmallDevices,
  getFormFontStyle,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, toHP, withCommas} from 'utils/format';
import {powerUp} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import OperationThemed from './OperationThemed';

export interface PowerUpOperationProps {
  currency?: string;
}

type Props = PropsFromRedux & PowerUpOperationProps;

const PowerUp = ({
  currency = 'HIVE',
  user,
  loadAccount,
  globalProperties,
}: Props) => {
  const [to, setTo] = useState(user.account.name);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onPowerUp = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      await powerUp(user.keys.active!, {
        amount: sanitizeAmount(amount, currency),
        to: sanitizeUsername(to),
        from: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.powerup_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error: ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);
  const availableHpAmount = getCurrencyProperties(currency, user.account)
    .value as string;

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            currentValue={`${withCommas(
              toHP(user.account.vesting_shares + '', globalProperties).toFixed(
                3,
              ),
            )} HP`}
            availableValue={availableHpAmount}
            additionalContainerStyle={styles.currentAvailableBalances}
            setMaxAvailable={(value) => setAmount(value)}
            additionalLabelTitleStyle={{
              fontSize: getFontSizeSmallDevices(height, 15),
            }}
          />
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <>
          <Separator height={35} />
          <Text
            style={[getFormFontStyle(height, theme).title, styles.infoText]}>
            {translate('wallet.operations.powerup.info_text')}
          </Text>
          <Separator />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name={Icons.AT} />}
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
              inputStyle={getFormFontStyle(height, theme).input}
              additionalLabelStyle={getFormFontStyle(height, theme).labelInput}
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
              inputStyle={getFormFontStyle(height, theme).input}
              additionalLabelStyle={getFormFontStyle(height, theme).labelInput}
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
                    onPress={() => setAmount(availableHpAmount.split(' ')[0])}>
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
        </>
      }
      childrenBottom={
        <ActiveOperationButton
          title={translate('wallet.operations.powerup.title')}
          onPress={onPowerUp}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          isLoading={loading}
          additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
        />
      }
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
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PowerUp);
