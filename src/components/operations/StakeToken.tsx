import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
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
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
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
  loadUserTokens,
}: Props) => {
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);

  const onStakeToken = async () => {
    if (!user.keys.active) {
      return Toast.show(
        translate('common.missing_key', {key: KeyTypes.active}),
      );
    }

    if (parseFloat(amount) <= 0) {
      return Toast.show(translate('common.need_positive_amount'), Toast.LONG);
    }

    setLoading(true);
    Keyboard.dismiss();

    const tokenOperationResult: any = await stakeToken(
      user.keys.active,
      user.name!,
      {
        to: sanitizeUsername(user.name!),
        symbol: currency,
        quantity: sanitizeAmount(amount),
      },
    );

    if (tokenOperationResult && tokenOperationResult.tx_id) {
      let confirmationResult: any = await BlockchainTransactionUtils.tryConfirmTransaction(
        tokenOperationResult.tx_id,
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
          Toast.show(
            translate('toast.token_stake_success', {currency}),
            Toast.LONG,
          );
        }
      } else {
        Toast.show(translate('toast.token_timeout'), Toast.LONG);
      }
    } else {
      Toast.show(
        translate('toast.tokens_operation_failed', {tokenOperation: 'stake'}),
        Toast.LONG,
      );
    }

    setLoading(false);
    loadAccount(user.account.name, true);
    loadUserTokens(user.name!);
    goBack();
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Delegate />}
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
  {loadAccount, loadUserTokens},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(StakeToken);
