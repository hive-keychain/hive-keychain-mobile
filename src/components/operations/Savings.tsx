import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import PickerItem, {PickerItemInterface} from 'components/form/PickerItem';
import Icon from 'components/hive/Icon';
import PendingSavingsWithdrawalPageComponent from 'components/hive/Pending-savings-withdrawal-page.component';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
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
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontJosefineSansName,
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {depositToSavings, withdrawFromSavings} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {SavingsUtils} from 'utils/savings.utils';
import OperationThemed from './OperationThemed';

export enum SavingsOperations {
  deposit = 'deposit',
  withdraw = 'withdraw',
}
export interface SavingOperationProps {
  currency: string;
  operation: SavingsOperations;
}

type Props = PropsFromRedux & SavingOperationProps;
const Convert = ({
  user,
  loadAccount,
  currency: c,
  operation,
  userSavingsWithdrawRequests,
}: Props) => {
  const [to, setTo] = useState(user.name!);
  const [currentWithdrawingList, setCurrentWithdrawingList] = useState<
    SavingsWithdrawal[]
  >([]);
  const [
    totalPendingSavingsWithdrawals,
    setTotalPendingSavingsWithdrawals,
  ] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(c);
  const [operationType, setOperationType] = useState<SavingsOperations>(
    operation,
  );
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, useWindowDimensions(), theme);
  const operationTypeList: PickerItemInterface[] = [
    {
      icon: (
        <Icon
          theme={theme}
          name={Icons.SEND_SQUARE}
          additionalContainerStyle={getRotateStyle('180')}
        />
      ),
      value: SavingsOperations.deposit,
      label: capitalize(SavingsOperations.deposit),
    },
    {
      icon: <Icon theme={theme} name={Icons.SEND_SQUARE} />,
      value: SavingsOperations.withdraw,
      label: capitalize(SavingsOperations.withdraw),
    },
  ];
  const currentBalance =
    currency === 'HIVE'
      ? user.account.savings_balance
      : user.account.savings_hbd_balance;
  const availableBalance =
    currency === 'HIVE' ? user.account.balance : user.account.hbd_balance;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (userSavingsWithdrawRequests > 0) {
      const pendingSavingsWithdrawalsList: SavingsWithdrawal[] = await SavingsUtils.getSavingsWitdrawFrom(
        user.name!,
      );
      setCurrentWithdrawingList(pendingSavingsWithdrawalsList);
      if (pendingSavingsWithdrawalsList.length > 0) {
        updateTotalSavingWithdrawals(pendingSavingsWithdrawalsList);
      }
    }
  };

  const updateTotalSavingWithdrawals = (
    pendingSavingsWithdrawalsList: SavingsWithdrawal[],
  ) => {
    setTotalPendingSavingsWithdrawals(
      pendingSavingsWithdrawalsList
        .filter((current) => current.amount.split(' ')[1] === c)
        .reduce(
          (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
          0,
        ),
    );
  };

  const onHandleUpdate = (list: SavingsWithdrawal[]) => {
    setCurrentWithdrawingList(list);
    updateTotalSavingWithdrawals(list);
  };

  const onSavings = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (operationType === SavingsOperations.deposit) {
        await depositToSavings(user.keys.active, {
          request_id: Date.now(),
          from: to,
          to: to,
          amount: `${(+amount).toFixed(3)} ${currency}`,
          memo: '',
        });
      } else {
        await withdrawFromSavings(user.keys.active, {
          request_id: Date.now(),
          from: to,
          to: to,
          amount: `${(+amount).toFixed(3)} ${currency}`,
          memo: '',
        });
      }
      loadAccount(user.account.name, true);
      goBack();
      if (operationType === SavingsOperations.deposit) {
        Toast.show(
          translate('toast.savings_deposit_success', {
            amount: `${(+amount).toFixed(3)} ${currency}`,
          }),
          Toast.LONG,
        );
      } else {
        Toast.show(
          translate('toast.savings_withdraw_success', {
            amount: `${(+amount).toFixed(3)} ${currency}`,
          }),
          Toast.LONG,
        );
      }
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMax = () => {
    if (operationType === SavingsOperations.deposit) {
      setAmount((availableBalance as string).split(' ')[0]);
    } else setAmount((currentBalance as string).split(' ')[0]);
  };

  return (
    <OperationThemed
      additionalContentContainerStyle={{paddingHorizontal: 20}}
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            currentValue={currentBalance as string}
            availableValue={availableBalance as string}
            additionalContainerStyle={styles.currentAvailableBalances}
            setMaxAvailable={(value) => setAmount(value)}
          />
          <Separator />
          {totalPendingSavingsWithdrawals > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigate('TemplateStack', {
                  titleScreen: capitalize(
                    translate(`wallet.operations.savings.pending`),
                  ),
                  component: (
                    <PendingSavingsWithdrawalPageComponent
                      currency={c}
                      operation={operationType}
                      currentWithdrawingList={currentWithdrawingList}
                      onUpdate={onHandleUpdate}
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
                  style={[styles.textBase, styles.josefineFont, styles.opaque]}>
                  {capitalize(translate(`wallet.operations.savings.pending`))}
                </Text>
                <Text
                  style={[styles.textBase, styles.title, styles.josefineFont]}>
                  {totalPendingSavingsWithdrawals} {currency}
                </Text>
              </View>
              <Icon
                theme={theme}
                name={Icons.EXPAND_THIN}
                additionalContainerStyle={getRotateStyle('90')}
              />
            </TouchableOpacity>
          )}
          <Separator height={25} />
        </>
      }
      childrenMiddle={
        <>
          {operationType === SavingsOperations.withdraw && (
            <>
              <Separator />
              <Text style={[styles.textBase, styles.opaque, styles.disclaimer]}>
                {translate(`wallet.operations.savings.disclaimer`, {currency})}
              </Text>
            </>
          )}
          <Separator />
          <Text style={[styles.textBase, styles.title]}>
            {translate('common.operation_type')}
          </Text>
          <PickerItem
            selected={operationTypeList.find(
              (item) => item.value === operationType,
            )}
            theme={theme}
            pickerItemList={operationTypeList}
            additionalSelectedItemContainerStyle={{paddingHorizontal: 10}}
            additionalExpandedListItemContainerStyle={styles.operationPicker}
            onSelectedItem={(item) =>
              setOperationType(item.value as SavingsOperations)
            }
          />
          <Separator />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name={Icons.AT} />}
            inputStyle={[styles.textBase, styles.paddingLeft]}
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
                  <TouchableOpacity onPress={() => handleSetMax()}>
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
            title={translate(
              `wallet.operations.savings.${operationType}_button`,
            )}
            onPress={onSavings}
            style={[getButtonStyle(theme).warningStyleButton]}
            isLoading={loading}
            additionalTextStyle={{...button_link_primary_medium}}
          />
          <Separator />
        </>
      }
    />
  );
};

const getDimensionedStyles = (
  color: string,
  {width, height}: Dimensions,
  theme: Theme,
) =>
  StyleSheet.create({
    disclaimer: {textAlign: 'center'},
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    displayAction: {
      marginHorizontal: 15,
      borderRadius: 26,
      paddingHorizontal: 21,
      paddingVertical: 13,
      justifyContent: 'space-between',
      flexDirection: 'row',
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
    operationPicker: {
      paddingHorizontal: 20,
      paddingVertical: 10,
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
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      userSavingsWithdrawRequests:
        state.activeAccount.account.savings_withdraw_requests,
    };
  },
  {
    loadAccount,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Convert);
