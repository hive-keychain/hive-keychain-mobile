import {loadAccount} from 'actions/index';
import CustomPicker from 'components/form/CustomPicker';
import CancelPendingSavingsWithdrawalItem from 'components/operations/Cancel-pending-savings-withdrawal-item';
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
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Icon from './Icon';

type Props = PropsFromRedux & {
  currency: string;
  operation: SavingsOperations;
  currentWithdrawingList: SavingsWithdrawal[];
};
const PendingSavingsWithdrawalPageComponent = ({
  user,
  loadAccount,
  currency: c,
  operation,
  currentWithdrawingList,
}: Props) => {
  const [currency, setCurrency] = useState(c);
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, useWindowDimensions());

  const renderListItem = (item: SavingsWithdrawal) => {
    const cancelSavingWithDraw = () => {
      navigate('ModalScreen', {
        name: 'CancelPendingSavingsWithdrawalItem',
        modalContent: (
          <CancelPendingSavingsWithdrawalItem
            item={item}
            itemList={currentWithdrawingList}
          />
        ),
      });
    };

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
      title={translate(
        'wallet.operations.savings.pending_withdraw.title_page',
      )}>
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
        <Text style={styles.disclaimer}>
          {translate(
            'wallet.operations.savings.pending_withdraw.pending_disclaimer',
            {currency},
          )}
        </Text>
        <Separator />
        <FlatList
          data={currentWithdrawingList.filter(
            (currentWithdrawItem) =>
              currentWithdrawItem.amount.split(' ')[1] === currency,
          )}
          keyExtractor={(listItem) => listItem.request_id.toString()}
          renderItem={(withdraw) => renderListItem(withdraw.item)}
          style={styles.containerMaxHeight}
          ListEmptyComponent={() => {
            return (
              <View style={[styles.containerCentered, styles.marginTop]}>
                <Text style={styles.boldText}>
                  {translate(
                    'wallet.operations.savings.pending_withdraw.no_pending_withdrawals',
                    {currency},
                  )}
                </Text>
              </View>
            );
          }}
        />
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
    containerCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerMaxHeight: {
      maxHeight: 200,
    },
    picker: {
      width: '80%',
      color: 'white',
      alignContent: 'center',
    },
    iosPickerText: {color: 'white'},
    marginTop: {
      marginTop: 30,
    },
    boldText: {
      fontWeight: 'bold',
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
export default connector(PendingSavingsWithdrawalPageComponent);
