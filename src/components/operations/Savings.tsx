import {loadAccount} from 'actions/index';
import Savings from 'assets/wallet/icon_savings.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomPicker from 'components/form/CustomPicker';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';
import SavingsBalance from './SavingsBalance';

type Props = PropsFromRedux & {currency: string; operation: SavingsOperations};
const Convert = ({user, loadAccount, currency: c, operation}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(c);

  const onSavings = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.convert_success', {currency}), Toast.LONG);
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, useWindowDimensions());
  return (
    <Operation
      logo={<Savings />}
      title={translate(`wallet.operations.savings.${operation}`)}>
      <>
        <View style={styles.container}>
          <CustomPicker
            list={['HIVE', 'HBD']}
            selectedValue={currency}
            onSelected={setCurrency}
            prompt={translate('wallet.operations.savings.prompt')}
            style={styles.picker}
            dropdownIconColor="white"
          />
        </View>
        {operation === SavingsOperations.deposit ? (
          <Balance currency={currency} account={user.account} />
        ) : (
          <SavingsBalance currency={currency} account={user.account} />
        )}
        <Separator />
        <Text style={styles.disclaimer}>
          {translate(`wallet.operations.savings.disclaimer`, {currency})}
        </Text>
        <Separator />
        <OperationInput
          placeholder={'0.000'}
          keyboardType="numeric"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />

        <Separator height={50} />
        <ActiveOperationButton
          title={translate(
            `wallet.operations.savings.${operation}_button`,
          ).toUpperCase()}
          onPress={onSavings}
          style={styles.button}
          isLoading={loading}
        />
      </>
    </Operation>
  );
};

const getDimensionedStyles = (color: string, {width, height}: Dimensions) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    disclaimer: {textAlign: 'justify'},
    container: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#7E8C9A',
      borderRadius: height / 30,
      marginVertical: height / 30,
      alignContent: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    picker: {
      width: '80%',
      color: 'white',
      alignContent: 'center',
    },
  });

export enum SavingsOperations {
  deposit = 'deposit',
  withdraw = 'withdraw',
}

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {
    loadAccount,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Convert);
