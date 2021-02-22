import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  View,
  useWindowDimensions,
} from 'react-native';
import {connect} from 'react-redux';
import hive, {getClient} from 'utils/dhive';
import Toast from 'react-native-simple-toast';

import Operation from './Operation';
import {translate} from 'utils/localize';
import OperationInput from 'components/form/OperationInput';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import Balance from './Balance';
import AccountLogoDark from 'assets/wallet/icon_username_dark.svg';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import {getCurrencyProperties} from 'utils/hiveReact';
import {goBack} from 'utils/navigation';
import {loadAccount} from 'actions';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {getTransferWarning} from 'utils/transferValidator';
import CustomRadioGroup from 'components/form/CustomRadioGroup';
import {encodeMemo} from 'components/bridge';
import {getAccountKeys} from 'utils/hiveUtils';
import {transfer, sendToken} from 'utils/hive';

const PUBLIC = translate('common.public').toUpperCase();
const PRIVATE = translate('common.private').toUpperCase();

const Transfer = ({
  currency,
  user,
  loadAccountConnect,
  engine,
  tokenBalance,
  tokenLogo,
  phishingAccounts,
}) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [privacy, setPrivacy] = useState(PUBLIC);

  const sendTransfer = async () => {
    setLoading(true);
    let finalMemo = memo;
    if (privacy === PRIVATE) {
      const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
      finalMemo = await encodeMemo(user.keys.memo, receiverMemoKey, `#${memo}`);
    }
    await transfer(user.keys.active, {
      amount: `${parseFloat(amount).toFixed(3)} ${currency}`,
      memo: finalMemo,
      to: to.toLowerCase(),
      from: user.account.name,
    });
  };

  const transferToken = async () => {
    setLoading(true);

    return await sendToken(user.keys.active, user.name, {
      symbol: currency,
      to: to.toLowerCase(),
      quantity: amount,
      memo: memo,
    });
  };

  const onSend = async () => {
    Keyboard.dismiss();
    try {
      if (!engine) {
        await sendTransfer();
        Toast.show(translate('toast.transfer_success'), Toast.LONG);
      } else {
        const {id} = await transferToken();
        const {confirmed} = await tryConfirmTransaction(id);
        Toast.show(
          confirmed
            ? translate('toast.transfer_token_confirmed')
            : translate('toast.transfer_token_unconfirmed'),
          Toast.LONG,
        );
      }
      loadAccountConnect(user.account.name);
      goBack();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const {height, width} = useWindowDimensions();

  const styles = getDimensionedStyles(color, height, width);
  if (step === 1) {
    return (
      <Operation
        logo={<SendArrowBlue />}
        title={translate('wallet.operations.transfer.title')}>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          tokenBalance={tokenBalance}
          tokenLogo={tokenLogo}
          engine={engine}
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
          keyboardType="numeric"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />
        <Separator />
        <OperationInput
          placeholder={translate('wallet.operations.transfer.memo')}
          value={memo}
          onChangeText={setMemo}
        />
        <Separator />
        <CustomRadioGroup
          list={[PUBLIC, PRIVATE]}
          selected={privacy}
          onSelect={setPrivacy}
        />
        <Separator height={20} />

        <ActiveOperationButton
          title={translate('common.send')}
          onPress={() => {
            if (!amount.length || !to.length) {
              Toast.show(
                translate('wallet.operations.transfer.warning.missing_info'),
              );
            } else {
              setStep(2);
            }
          }}
          style={styles.send}
          isLoading={loading}
        />
      </Operation>
    );
  } else {
    return (
      <Operation
        logo={<SendArrowBlue />}
        title={translate('wallet.operations.transfer.title')}>
        <Separator height={30} />
        <Text style={styles.warning}>
          {getTransferWarning(phishingAccounts, to, currency, !!memo).warning}
        </Text>
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.from')}
        </Text>
        <Text style={styles.field}>{`@${user.account.name}`}</Text>
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.to')}
        </Text>
        <Text style={styles.field}>{`@${to} ${
          getTransferWarning(phishingAccounts, to, currency, !!memo).exchange
            ? '(exchange)'
            : ''
        }`}</Text>
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.amount')}
        </Text>
        <Text style={styles.field}>{`${amount} ${currency}`}</Text>
        <Separator />
        {memo.length ? (
          <>
            <Text style={styles.title}>
              {translate('wallet.operations.transfer.confirm.memo')}
            </Text>
            <Text style={styles.field}>{`${memo} ${
              privacy === PRIVATE ? '(encrypted)' : ''
            }`}</Text>
          </>
        ) : null}
        <Separator height={40} />
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            style={styles.back}
            onPress={() => {
              setStep(1);
            }}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={onSend}
            style={styles.confirm}
            isLoading={loading}
          />
        </View>
      </Operation>
    );
  }
};

const getDimensionedStyles = (color, height, width) =>
  StyleSheet.create({
    send: {backgroundColor: '#68A0B4'},
    confirm: {
      backgroundColor: '#68A0B4',
      width: width / 3,
      marginHorizontal: 0,
    },
    warning: {color: 'red', fontWeight: 'bold'},
    back: {backgroundColor: '#7E8C9A', width: width / 3, marginHorizontal: 0},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    title: {fontWeight: 'bold', fontSize: 16},
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {loadAccountConnect: loadAccount},
)(Transfer);
