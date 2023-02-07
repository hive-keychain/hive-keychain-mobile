import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import IconBack from 'src/assets/Icon_arrow_back_black.svg';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {cancelDelegateToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import Balance from './Balance';
import Operation from './Operation';
//TODO here, important: change names & beheviours.
type Props = PropsFromRedux & {
  currency: string;
  tokenLogo: JSX.Element;
  from?: string;
  amount?: string;
  gobackAction?: () => void;
};

const CancelDelegationToken = ({
  currency,
  user,
  loadAccount,
  tokenLogo,
  from,
  amount,
  loadUserTokens,
  gobackAction,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onCancelDelegateToken = async () => {
    if (!(await AccountUtils.doesAccountExist(from))) {
      return Toast.show(translate('toast.no_such_account'), Toast.LONG);
    }

    if (!user.keys.active) {
      return Toast.show(
        translate('common.missing_key', {key: KeyTypes.active}),
      );
    }

    setLoading(true);
    Keyboard.dismiss();

    const tokenOperationResult: any = await cancelDelegateToken(
      user.keys.active,
      user.name!,
      {from: from, symbol: currency, quantity: amount},
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
            translate('toast.token_cancel_delegation_sucess', {currency}),
            Toast.LONG,
          );
        }
      } else {
        Toast.show(translate('toast.token_timeout'), Toast.LONG);
      }
    } else {
      Toast.show(
        translate('toast.tokens_operation_failed', {
          tokenOperation: 'cancel delegation',
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
        <TouchableOpacity
          onPress={() => gobackAction()}
          style={styles.goBackButton}>
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

export default connector(CancelDelegationToken);
