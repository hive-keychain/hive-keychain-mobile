import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import {Caption} from 'components/ui/Caption';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
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
import {navigate} from 'utils/navigation';
import {ConfirmationPageProps} from './Confirmation';
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
  showModal,
  properties,
  delegatee,
}: Props) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onDelegate = async () => {
    try {
      await delegate(user.keys.active, {
        vesting_shares: sanitizeAmount(
          fromHP(sanitizeAmount(amount), properties.globals).toString(),
          'VESTS',
          6,
        ),
        delegatee: sanitizeUsername(to),
        delegator: user.account.name,
      });
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        showModal('toast.delegation_success', MessageModalType.SUCCESS);
      } else {
        showModal('toast.stop_delegation_success', MessageModalType.SUCCESS);
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

  const onDelegateConfirmation = () => {
    if (!to || !amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (+amount > parseFloat(available as string)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onDelegate,
        title: 'wallet.operations.delegation.confirm.info',
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
            value: `${amount} ${currency}`,
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
      additionalBgSvgImageStyle={{
        top: -40,
      }}
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
                  styles.availablePanelTitle,
                  styles.josefineFont,
                  styles.opaque,
                ]}>
                {capitalize(translate(`common.available`))}
              </Text>
              <Text style={[styles.availablePanelValue, styles.josefineFont]}>
                {`${withCommas(available.toString())} ${getCurrency('HP')}`}
              </Text>
            </View>
          </TouchableOpacity>
          <Separator />
        </>
      }
      childrenMiddle={
        <View>
          <Caption text="wallet.operations.delegation.delegation_disclaimer" />
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
        </View>
      }
      buttonTitle={'common.send'}
      onNext={onDelegateConfirmation}
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    availablePanelTitle: {
      color: getColors(theme).secondaryText,
      fontSize: 14,
    },
    availablePanelValue: {
      color: getColors(theme).primaryText,
      fontSize: 16,
    },
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
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Delegation);
