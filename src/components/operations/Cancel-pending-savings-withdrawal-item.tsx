import {loadAccount, loadUserTokens} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CurrentSavingsWithdrawComponent, {
  SavingsOperations,
} from 'components/hive/CurrentSavingsWithdrawComponent';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import IconBack from 'src/assets/Icon_arrow_back_black.svg';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {RootState} from 'store';
import {cancelPendingSavings} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import Operation from './Operation';
//TODO here, important: change names & beheviours.
type Props = PropsFromRedux & {
  item: SavingsWithdrawal;
  itemList: SavingsWithdrawal[];
};

const CancelPendingSavingsWithdrawalItem = ({
  item,
  itemList,
  user,
  loadAccount,
  loadUserTokens,
}: Props) => {
  const [loading, setLoading] = useState(false);

  console.log('about to remove: ', {item}); //TODO to remove
  const onCancelPendingSavings = async () => {
    setLoading(true);
    Keyboard.dismiss();

    const cancelPendingSavingsResult: any = await cancelPendingSavings(
      user.keys.active!,
      {from: user.name!, request_id: item.request_id},
    );

    console.log({cancelPendingSavingsResult}); //TODO to remove
    //TODO here,
    //  just follow same pattern as extension, if we have a cancelPendingSavingsItemResult.tx_id, then success -> goBack to main wallet screen so it
    //  will render the updated savings.
    //  if not error, just go back as it is now -> goBackPendingWithdrawals

    //TODO update all bellow following the extension. :)
    if (cancelPendingSavingsResult && cancelPendingSavingsResult.tx_id) {
      let confirmationResult: any = await BlockchainTransactionUtils.tryConfirmTransaction(
        cancelPendingSavingsResult.tx_id,
      );

      if (confirmationResult && confirmationResult.confirmed) {
        if (confirmationResult.error) {
          Toast.show(
            translate('toast.hive_engine_error', {
              error: confirmationResult.error,
            }),
            Toast.LONG,
          );
        } else {
          //TODO create locales...
          Toast.show(
            `Withdraw savings canceled: rId: ${item.request_id}`,
            Toast.LONG,
          );
        }
      } else {
        Toast.show(translate('toast.token_timeout'), Toast.LONG);
      }
    } else {
      //TODO add failed message locales
      Toast.show('Cancel pending savings withdraw failed!!!', Toast.LONG);
    }

    setLoading(false);
    loadAccount(user.account.name, true);
    loadUserTokens(user.name!);
    goBackPendingWithdrawals();
  };

  // const {color} = getCurrencyProperties(currency);

  const color = 'red';
  const styles = getDimensionedStyles(color);

  const goBackPendingWithdrawals = () => {
    navigate('ModalScreen', {
      name: 'CancelSavingsWithdraw',
      modalContent: (
        <CurrentSavingsWithdrawComponent
          operation={SavingsOperations.deposit}
          currency={'HBD'}
          currentWithdrawingList={itemList}
        />
      ),
    });
  };

  const renderGoBackComponent = () => {
    return (
      <View style={styles.rowContainer}>
        <TouchableOpacity
          onPress={goBackPendingWithdrawals}
          style={styles.goBackButton}>
          <IconBack />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Operation
      logo={renderGoBackComponent()}
      //TODO add to locales all bellow
      title="CANCEL WITHDRAW">
      <>
        <Text>
          Please confirm that you want to cancel this $1 withdraw from savings.
        </Text>
        <Separator />

        <Text>
          {item.amount} {moment(item.complete).format('L')}
        </Text>

        <Separator height={50} />

        <ActiveOperationButton
          title={translate('common.confirm')}
          //TODO finish here bellow
          onPress={onCancelPendingSavings}
          style={styles.button}
          isLoading={loading}
        />
      </>
    </Operation>
  );
};

const getDimensionedStyles = (color: string) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    goBackButton: {
      margin: 7,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CancelPendingSavingsWithdrawalItem);
