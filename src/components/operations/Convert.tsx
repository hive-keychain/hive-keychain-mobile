import {fetchConversionRequests} from 'actions/index';
import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import PendingConvertions from 'components/hive/PendingConversions';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import {TemplateStackProps} from 'navigators/Root.types';
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
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {FontJosefineSansName, getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, getCleanAmountValue, withCommas} from 'utils/format';
import {collateralizedConvert, convert} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Balance from './Balance';
import {ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export interface ConvertOperationProps {
  currency: 'HBD' | 'HIVE';
}

type Props = PropsFromRedux & ConvertOperationProps;
const Convert = ({
  user,
  showModal,
  fetchConversionRequests,
  conversions,
  currency,
}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPendingConvertions, setTotalPendingConvertions] = useState(0);
  const [availableBalance, setAvailableBalance] = useState('');

  useEffect(() => {
    fetchConversionRequests(user.name!, currency);
  }, [user.name, fetchConversionRequests]);

  useEffect(() => {
    if (conversions.length > 0) {
      setTotalPendingConvertions(
        conversions
          .filter(
            (conversion) =>
              moment(conversion.conversion_date).isAfter() &&
              conversion.amount.split(' ')[1] === currency,
          )
          .reduce(
            (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
            0,
          ),
      );
    }
  }, [conversions]);

  const onConvert = async () => {
    try {
      if (currency === 'HBD') {
        await convert(user.keys.active!, {
          owner: user.account.name,
          amount: sanitizeAmount(amount, 'HBD'),
          requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
        });
      } else {
        await collateralizedConvert(user.keys.active!, {
          owner: user.account.name,
          amount: sanitizeAmount(amount, 'HIVE'),
          requestid: Math.max(...conversions.map((e) => e.requestid), 0) + 1,
        });
      }
      showModal('toast.convert_success', MessageModalType.SUCCESS, {
        currency,
      });
    } catch (e) {
      showModal(
        `Error : ${(e as any).message}`,
        MessageModalType.ERROR,
        null,
        true,
      );
    }
  };

  const onConvertConfirmation = () => {
    if (!amount) {
      Toast.show(translate('wallet.operations.convert.warning.missing_info'));
    } else if (+amount > +getCleanAmountValue(availableBalance)) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onConvert,
        title: 'wallet.operations.convert.confirm.info',
        data: [
          {
            title: 'common.account',
            value: `@${user.account.name}`,
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: `${withCommas(amount)} ${currency}`,
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
      additionalContentContainerStyle={styles.paddingHorizontal}
      additionalBgSvgImageStyle={{
        top: -40,
      }}
      childrenTop={
        <>
          <Separator />
          <Balance
            theme={theme}
            currency={currency}
            account={user.account}
            setAvailableBalance={(available) => setAvailableBalance(available)}
          />
          <Separator />
          {totalPendingConvertions > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                navigate('TemplateStack', {
                  titleScreen: capitalize(
                    translate(`wallet.operations.convert.pending`),
                  ),
                  component: (
                    <PendingConvertions
                      currency={currency}
                      currentPendingConvertionList={conversions}
                    />
                  ),
                } as TemplateStackProps);
              }}
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.displayAction,
              ]}>
              <View>
                <Text
                  style={[
                    getFormFontStyle(height, theme).smallLabel,
                    styles.josefineFont,
                    styles.opaque,
                  ]}>
                  {capitalize(translate(`common.pending`))}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).input,
                    styles.josefineFont,
                  ]}>
                  {totalPendingConvertions} {currency}
                </Text>
              </View>
              <Icon
                theme={theme}
                name={Icons.EXPAND_THIN}
                additionalContainerStyle={getRotateStyle('90')}
                width={13}
                height={13}
              />
            </TouchableOpacity>
          )}
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <View>
          <Caption
            text={`wallet.operations.convert.disclaimer_${currency.toLowerCase()}`}
          />
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
                      setAmount(getCleanAmountValue(availableBalance))
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
          <Separator />
        </View>
      }
      buttonTitle={'wallet.operations.convert.button'}
      onNext={onConvertConfirmation}
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    conversionRow: {
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    conversionContainer: {
      height: 80,
    },
    disclaimer: {textAlign: 'justify', fontSize: 14},
    displayAction: {
      marginHorizontal: 15,
      borderRadius: 26,
      paddingHorizontal: 21,
      paddingVertical: 13,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    opaque: {
      opacity: 0.7,
    },
    paddingHorizontal: {paddingHorizontal: 15},
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
    paddingLeft: {
      paddingLeft: 10,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      conversions: state.conversions,
    };
  },
  {
    showModal,
    fetchConversionRequests,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Convert);
