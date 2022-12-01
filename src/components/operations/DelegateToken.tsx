import {loadAccount} from 'actions/index';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {delegateToken} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
};

const DelegateToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
}: Props) => {
  //TODO remove comments when finished.
  //TODO using same patterns:
  //  - code show list of incomming/outgoing token's delegations.
  //  - code total token incomming/outgoing delegations.
  //  - for outgoing, code the edit/delete button which:
  //    -> Edit:    it will add a new token's delegation.
  //    -> Delete:  it will set a new token delegation but as 0.000 so it will cancel.
  //                Using hive.cancelDelegateToken obj = { from: from, symbol: symbol, quantity: amount }
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onDelegateToken = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const delegate = await delegateToken(user.keys.active, user.name!, {
        to: sanitizeUsername(to),
        symbol: currency,
        quantity: sanitizeAmount(amount),
      });
      console.log({delegate}); //TODO to remove
      const {id} = delegate;
      const {confirmed} = await tryConfirmTransaction(id);
      Toast.show(
        confirmed
          ? translate('toast.token_delegate_sucess')
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
      title={translate('wallet.operations.token_delegation.delegating_token', {
        currency,
      })}>
      <>
        <Text>
          {translate('wallet.operations.token_delegation.info_requirements')}
        </Text>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          isHiveEngine
          globalProperties={properties.globals}
          setMax={(value: string) => {
            setAmount(value);
          }}
          tokenLogo={tokenLogo}
          tokenBalance={balance}
        />

        <Separator />
        <OperationInput
          placeholder={translate('common.username').toUpperCase()}
          leftIcon={<AccountLogoDark />}
          autoCapitalize="none"
          value={to}
          onChangeText={setTo}
        />
        <Separator />
        <OperationInput
          placeholder={'0.000'}
          keyboardType="decimal-pad"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />

        <Separator height={40} />
        <ActiveOperationButton
          title={translate('common.delegate')}
          onPress={onDelegateToken}
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
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegateToken);
