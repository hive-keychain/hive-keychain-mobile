import {loadAccount, loadUserTokens} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import PendingSavingsWithdrawalPageComponent, {
  SavingsOperations,
} from 'components/hive/Pending-savings-withdrawal-page.component';
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
import {goBack, navigate} from 'utils/navigation';
import Operation from './Operation';

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

  const onCancelPendingSavings = async () => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      await cancelPendingSavings(user.keys.active!, {
        from: user.name!,
        request_id: item.request_id,
      });
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(
        translate(
          'wallet.operations.savings.pending_withdraw.cancelled.success',
        ),
        Toast.LONG,
      );
    } catch (e) {
      Toast.show(`Error: ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const color = 'red';
  const styles = getDimensionedStyles(color);

  const goBackPendingWithdrawals = () => {
    navigate('ModalScreen', {
      name: 'CancelSavingsWithdraw',
      modalContent: (
        <PendingSavingsWithdrawalPageComponent
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
      title={translate(
        'wallet.operations.savings.pending_withdraw.cancel_withdraw_title',
      )}>
      <>
        <Text style={styles.marginTop}>
          {translate(
            'wallet.operations.savings.pending_withdraw.cancel_confirm_disclaimer',
          )}
        </Text>
        <Separator />

        <View style={styles.itemContainer}>
          <Text>{item.amount}</Text>
          <Text>{moment(item.complete).format('L')}</Text>
        </View>

        <Separator height={50} />

        <ActiveOperationButton
          title={translate('common.confirm')}
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
    marginHorizontal: {
      marginHorizontal: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    marginTop: {
      marginTop: 12,
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
