import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
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
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  FontJosefineSansName,
  getFormFontStyle,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, fromHP, toHP, withCommas} from 'utils/format';
import {delegate, getCurrency} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import DelegationsList from './DelegationsList';
import OperationThemed from './OperationThemed';

export interface DelegationOperationProps {
  currency?: string;
  delegatee?: string;
}

type Props = PropsFromRedux & DelegationOperationProps;

const Delegation = ({
  currency = 'HP',
  user,
  loadAccount,
  properties,
  delegatee,
}: Props) => {
  const [to, setTo] = useState(delegatee || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onDelegate = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const delegation = await delegate(user.keys.active, {
        vesting_shares: sanitizeAmount(
          fromHP(sanitizeAmount(amount), properties.globals).toString(),
          'VESTS',
          6,
        ),
        delegatee: sanitizeUsername(to),
        delegator: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        Toast.show(translate('toast.delegation_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_delegation_success'), Toast.LONG);
      }
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const {height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  const totalHpIncoming = `+${withCommas(
    toHP(user.account.received_vesting_shares as string, properties.globals)
      .toFixed(3)
      .toString(),
  )} ${getCurrency('HP')}`;

  const totalHpOutgoing = `-${withCommas(
    toHP(user.account.delegated_vesting_shares as string, properties.globals)
      .toFixed(3)
      .toString(),
  )} ${getCurrency('HP')}`;

  const totalHp = toHP(
    user.account.vesting_shares as string,
    properties.globals,
  );
  const totalOutgoing = toHP(
    user.account.delegated_vesting_shares as string,
    properties.globals,
  );
  const available = Math.max(totalHp - totalOutgoing - 5, 0).toFixed(4);

  const onHandleNavigateToDelegations = (type: 'incoming' | 'outgoing') => {
    navigate('TemplateStack', {
      titleScreen: translate(`common.${type}`),
      component: <DelegationsList type={type} theme={theme} />,
    } as TemplateStackProps);
  };

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            height={height}
            currentValue={totalHpIncoming}
            availableValue={totalHpOutgoing}
            additionalContainerStyle={styles.currentAvailableBalances}
            setMaxAvailable={(value) => setAmount(value)}
            leftLabelTranslationKey="wallet.operations.delegation.total_incoming"
            rightLabelTranslationKey="wallet.operations.delegation.total_outgoing"
            onleftClick={() => onHandleNavigateToDelegations('incoming')}
            onRightClick={() => onHandleNavigateToDelegations('outgoing')}
          />
          <Separator />
          <TouchableOpacity
            onPress={() => setAmount(withCommas(available.toString()))}
            style={[
              getCardStyle(theme, 30).defaultCardItem,
              {marginHorizontal: 15, paddingVertical: 10},
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
                {`${withCommas(available.toString())} ${getCurrency('HP')}`}
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
            {translate('wallet.operations.delegation.delegation_disclaimer')}
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
                    onPress={() => setAmount(withCommas(available))}>
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
            title={translate('common.send')}
            onPress={onDelegate}
            style={[getButtonStyle(theme).warningStyleButton]}
            isLoading={loading}
            additionalTextStyle={getFormFontStyle(height, theme, 'white').title}
          />
          <Separator />
        </>
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
    opaque: {
      opacity: 0.7,
    },
    textCentered: {textAlign: 'center'},
    disclaimer: {
      paddingHorizontal: 8,
    },
    paddingLeft: {
      paddingLeft: 10,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    title: {
      fontSize: 15,
    },
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

export default connector(Delegation);
