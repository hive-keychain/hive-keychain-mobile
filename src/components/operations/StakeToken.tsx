import {loadAccount} from 'actions/index';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {stakeToken} from 'utils/hive';
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

const StakeToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
}: Props) => {
  //TODO remove comments when finished.
  //   const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onStakeToken = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      //TODO implement stake token using the same pattern
      //   const delegation = await delegate(user.keys.active, {
      //     vesting_shares: sanitizeAmount(
      //       fromHP(sanitizeAmount(amount), properties.globals).toString(),
      //       'VESTS',
      //       6,
      //     ),
      //     delegatee: sanitizeUsername(to),
      //     delegator: user.account.name,
      //   });
      const stake = await stakeToken(user.keys.active, user.name!, {
        to: sanitizeUsername(user.name!),
        symbol: currency,
        quantity: sanitizeAmount(amount),
      });
      console.log({stake}); //TODO to remove
      const {id} = stake;
      const {confirmed} = await tryConfirmTransaction(id);
      Toast.show(
        confirmed
          ? translate('toast.token_stake_success')
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
      logo={<Delegate />} //TODO change logo
      title={translate('wallet.operations.token_stake.staking_token', {
        currency,
      })}>
      <>
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

        {/* <Separator /> */}
        {/* <OperationInput
          placeholder={translate('common.username').toUpperCase()}
          leftIcon={<AccountLogoDark />}
          autoCapitalize="none"
          value={to}
          onChangeText={setTo}
        /> */}
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
          title={translate('common.stake')}
          onPress={onStakeToken}
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

export default connector(StakeToken);
