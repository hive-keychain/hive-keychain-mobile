import {loadAccount} from 'actions/index';
import CustomPicker from 'components/form/CustomPicker';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {CurrentWithdrawingListItem} from 'src/interfaces/list-item.interface';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import Icon from './Icon';
//TODO rename using same pattern as extension.
type Props = PropsFromRedux & {
  currency: string;
  operation: SavingsOperations;
  currentWithdrawingList: CurrentWithdrawingListItem[];
};
const CurrentSavingsWithdrawComponent = ({
  user,
  loadAccount,
  currency: c,
  operation,
  currentWithdrawingList,
}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(c);

  //   const onSavings = async () => {
  //     Keyboard.dismiss();
  //     setLoading(true);
  //     try {
  //       if (operation === SavingsOperations.deposit) {
  //         await depositToSavings(user.keys.active, {
  //           request_id: Date.now(),
  //           from: user.name,
  //           to: user.name,
  //           amount: `${(+amount).toFixed(3)} ${currency}`,
  //           memo: '',
  //         });
  //       } else {
  //         await withdrawFromSavings(user.keys.active, {
  //           request_id: Date.now(),
  //           from: user.name,
  //           to: user.name,
  //           amount: `${(+amount).toFixed(3)} ${currency}`,
  //           memo: '',
  //         });
  //       }
  //       loadAccount(user.account.name, true);
  //       goBack();
  //       if (operation === SavingsOperations.deposit) {
  //         Toast.show(
  //           translate('toast.savings_deposit_success', {
  //             amount: `${(+amount).toFixed(3)} ${currency}`,
  //           }),
  //           Toast.LONG,
  //         );
  //       } else {
  //         Toast.show(
  //           translate('toast.savings_withdraw_success', {
  //             amount: `${(+amount).toFixed(3)} ${currency}`,
  //           }),
  //           Toast.LONG,
  //         );
  //       }
  //     } catch (e) {
  //       Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, useWindowDimensions());

  const renderListItem = (item: CurrentWithdrawingListItem) => {
    const cancelSavingWithDraw = () => {};

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
        }}>
        <Text>{item.amount}</Text>
        <Text>{moment(item.complete).format('L')}</Text>
        <TouchableOpacity onPress={cancelSavingWithDraw}>
          <Icon name="delete" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Operation
      logo={<Icon name="savings" />}
      //TODO add into locales
      title={'PENDING WITHDRAWAL'}>
      <>
        <View style={styles.container}>
          <CustomPicker
            list={['HIVE', 'HBD']}
            selectedValue={currency}
            onSelected={setCurrency}
            prompt={translate('wallet.operations.savings.prompt')}
            style={styles.picker}
            dropdownIconColor="white"
            iosTextStyle={styles.iosPickerText}
          />
        </View>

        {/* //TODO add bellow into locales */}
        <Text style={styles.disclaimer}>
          {`Withdrawing from savings takes 3 days. Cancel the operation if you wish to keep your ${currency} in the savings.`}
        </Text>
        <Separator />
        <FlatList
          data={currentWithdrawingList.filter(
            (currentWithdrawItem) =>
              currentWithdrawItem.amount.split(' ')[1] === currency,
          )}
          keyExtractor={(listItem) => listItem.request_id.toString()}
          renderItem={(withdraw) => renderListItem(withdraw.item)}
          //TODO move style to styles.
          style={{maxHeight: 200}}
        />
        {/* <OperationInput
          placeholder={'0.000'}
          keyboardType="numeric"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        /> */}
        {/* <Separator height={50} />
        <ActiveOperationButton
          title={''}
          onPress={() => {}} //onSavings
          style={styles.button}
          isLoading={loading}
        /> */}
        <Separator />
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
      minHeight: 50,
    },
    picker: {
      width: '80%',
      color: 'white',
      alignContent: 'center',
    },
    iosPickerText: {color: 'white'},
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
export default connector(CurrentSavingsWithdrawComponent);
