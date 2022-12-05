import {loadAccount} from 'actions/index';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {cancelDelegateToken} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {
  currency: string;
  tokenLogo: JSX.Element;
  from?: string;
  amount?: string;
};

const CancelDelegationToken = ({
  currency,
  user,
  loadAccount,
  tokenLogo,
  from,
  amount,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onCancelDelegateToken = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const cancelDelegation = await cancelDelegateToken(
        user.keys.active,
        user.name!,
        {from: from, symbol: currency, quantity: amount},
      );
      console.log({cancelDelegation}); //TODO to remove
      const {id} = cancelDelegation;
      const {confirmed} = await tryConfirmTransaction(id);
      Toast.show(
        confirmed
          ? translate('toast.token_cancel_delegation_sucess')
          : translate('toast.transfer_token_unconfirmed'),
        Toast.LONG,
      );
      loadAccount(user.account.name, true);
      goBack();
    } catch (e) {
      Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);

  return (
    <Operation
      logo={<Delegate />}
      title={translate('wallet.operations.token_delegation.cancel_delegation', {
        currency,
      })}>
      <>
        <Text>
          {translate(
            'wallet.operations.token_delegation.title_confirm_cancel_delegation',
            {amount: amount, currency: currency},
          )}
        </Text>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          isHiveEngine
          tokenLogo={tokenLogo}
          tokenBalance={amount}
        />

        <Separator />

        <Text>@{from}</Text>

        <Separator height={40} />

        <ActiveOperationButton
          title={translate('common.confirm')}
          onPress={onCancelDelegateToken}
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
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CancelDelegationToken);
