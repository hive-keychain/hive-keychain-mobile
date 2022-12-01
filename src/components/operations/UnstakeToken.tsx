import {loadAccount} from 'actions/index';
import {Token} from 'actions/interfaces';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {unstakeToken} from 'utils/hive';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
  tokenInfo: Token;
};

const UnstakeToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
  tokenInfo,
}: Props) => {
  //TODO remove comments when finished.
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onStakeToken = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const unstake = await unstakeToken(user.keys.active, user.name!, {
        symbol: currency,
        quantity: sanitizeAmount(amount),
      });
      console.log({unstake}); //TODO to remove
      const {id} = unstake;
      const {confirmed} = await tryConfirmTransaction(id);
      Toast.show(
        confirmed
          ? translate('toast.token_unstake_success')
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
      title={translate('wallet.operations.token_unstake.unstaking_token', {
        currency,
      })}>
      <>
        <Text>
          {translate('wallet.operations.token_unstake.cooldown_disclaimer', {
            unstakingCooldown: tokenInfo.unstakingCooldown,
          })}
          {tokenInfo.unstakingCooldown === 1 ? '' : 's'}
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
          placeholder={'0.000'}
          keyboardType="decimal-pad"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />

        <Separator height={40} />
        <ActiveOperationButton
          title={translate('common.unstake')}
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

export default connector(UnstakeToken);
