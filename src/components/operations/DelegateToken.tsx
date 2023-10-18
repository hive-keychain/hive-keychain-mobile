import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import IconBack from 'src/assets/Icon_arrow_back_black.svg';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {delegateToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import Balance from './Balance';
import Operation from './Operation';

export interface DelegateTokenProps {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
  sendTo?: string;
  delegateAmount?: string;
  update?: boolean;
  gobackAction?: () => void;
}

type Props = PropsFromRedux & DelegateTokenProps;

const DelegateToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
  sendTo,
  delegateAmount,
  update,
  loadUserTokens,
  gobackAction,
}: Props) => {
  const [to, setTo] = useState(sendTo || '');
  const [amount, setAmount] = useState(delegateAmount || '');
  const [loading, setLoading] = useState(false);

  const onDelegateToken = async () => {
    if (!(await AccountUtils.doesAccountExist(to))) {
      return Toast.show(translate('toast.no_such_account'), Toast.LONG);
    }

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

    const tokenOperationResult: any = await delegateToken(
      user.keys.active,
      user.name!,
      {
        to: sanitizeUsername(to),
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
            translate('toast.token_delegate_sucess', {currency}),
            Toast.LONG,
          );
        }
      } else {
        Toast.show(translate('toast.token_timeout'), Toast.LONG);
      }
    } else {
      Toast.show(
        translate('toast.tokens_operation_failed', {
          tokenOperation: 'delegate',
        }),
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

  const renderIconComponent = () => {
    return gobackAction ? (
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={gobackAction} style={styles.goBackButton}>
          <IconBack />
        </TouchableOpacity>
      </View>
    ) : (
      <Delegate />
    );
  };

  return (
    <Operation
      logo={renderIconComponent()}
      title={translate('wallet.operations.token_delegation.delegating_token', {
        currency,
      })}>
      <>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          isHiveEngine
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
          title={translate(update ? 'common.confirm' : 'common.delegate')}
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
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegateToken);
