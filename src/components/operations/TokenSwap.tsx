import {loadAccount} from 'actions/index';
import SendArrowBlue from 'assets/wallet/icon_send_blue.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Operation from './Operation';

type TokenSwapOperationProps = {
  currency: string;
  engine: boolean;
  tokenBalance: string;
  tokenLogo: JSX.Element;
};
type Props = PropsFromRedux & TokenSwapOperationProps;
const TokenSwap = ({
  currency,
  user,
  loadAccount,
  engine,
  tokenBalance,
  tokenLogo,
  phishingAccounts,
}: Props) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [exec, setExec] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  //   const [privacy, setPrivacy] = useState(PUBLIC);
  const [isRecurrent, setRecurrent] = useState(false);

  //   const sendTransfer = async () => {
  //     setLoading(true);
  //     let finalMemo = memo;
  //     if (privacy === PRIVATE) {
  //       const receiverMemoKey = (await getAccountKeys(to.toLowerCase())).memo;
  //       finalMemo = await encodeMemo(user.keys.memo, receiverMemoKey, `#${memo}`);
  //     }
  //     if (!isRecurrent) {
  //       await transfer(user.keys.active, {
  //         amount: sanitizeAmount(amount, currency),
  //         memo: finalMemo,
  //         to: sanitizeUsername(to),
  //         from: user.account.name,
  //       });
  //     } else {
  //       await recurrentTransfer(user.keys.active, {
  //         amount: sanitizeAmount(amount, currency),
  //         memo: finalMemo,
  //         to: sanitizeUsername(to),
  //         from: user.account.name,
  //         recurrence: +recurrence,
  //         executions: +exec,
  //         extensions: [],
  //       });
  //     }
  //   };

  //   const transferToken = async () => {
  //     setLoading(true);

  //     return await sendToken(user.keys.active, user.name, {
  //       symbol: currency,
  //       to: sanitizeUsername(to),
  //       quantity: sanitizeAmount(amount),
  //       memo: memo,
  //     });
  //   };

  //   const onSend = async () => {
  //     Keyboard.dismiss();
  //     try {
  //       if (!engine) {
  //         await sendTransfer();
  //         Toast.show(
  //           translate(
  //             isRecurrent
  //               ? 'toast.recurrent_transfer_success'
  //               : 'toast.transfer_success',
  //           ),
  //           Toast.LONG,
  //         );
  //       } else {
  //         const {id} = await transferToken();
  //         const {confirmed} = await tryConfirmTransaction(id);
  //         Toast.show(
  //           confirmed
  //             ? translate('toast.transfer_token_confirmed')
  //             : translate('toast.transfer_token_unconfirmed'),
  //           Toast.LONG,
  //         );
  //       }
  //       loadAccount(user.account.name, true);
  //       goBack();
  //     } catch (e) {
  //       Toast.show(
  //         beautifyTransferError(e as any, {
  //           to,
  //           currency,
  //           username: user.account.name,
  //         }),
  //         Toast.LONG,
  //       );
  //       setLoading(false);
  //     }
  //   };

  const {color} = getCurrencyProperties(currency);
  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(color, height);

  return (
    <Operation
      logo={<SendArrowBlue />}
      title={translate('swapTokens.swap_token_title_modal')}>
      <ScrollView>
        <Separator height={30} />
        {/* <Text style={styles.warning}>
          {getTransferWarning(phishingAccounts, to, currency, !!memo).warning}
        </Text> */}
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.from')}
        </Text>
        <Text>{`@${user.account.name}`}</Text>
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.to')}
        </Text>
        {/* <Text>{`@${to} ${
          getTransferWarning(phishingAccounts, to, currency, !!memo).exchange
            ? '(exchange)'
            : ''
        }`}</Text> */}
        <Separator />
        <Text style={styles.title}>
          {translate('wallet.operations.transfer.confirm.amount')}
        </Text>
        <Text>{`${amount} ${currency}`}</Text>

        {/* {memo.length ? (
            <>
              <Separator />
              <Text style={styles.title}>
                {translate('wallet.operations.transfer.confirm.memo')}
              </Text>
              <Text>{`${memo} ${
                privacy === PRIVATE ? '(encrypted)' : ''
              }`}</Text>
            </>
          ) : null} */}
        <Separator />
        {/* {isRecurrent ? (
          <>
            <Text style={styles.title}>
              {translate('wallet.operations.transfer.confirm.recurrence')}
            </Text>
            <Text>
              {translate('wallet.operations.transfer.confirm.recurrenceData', {
                exec,
                recurrence,
              })}
            </Text>
          </>
        ) : null} */}
        <Separator height={40} />
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            style={styles.back}
            onPress={() => goBack()}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={() => {}} //onSend
            style={styles.confirm}
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </Operation>
  );
};

const getDimensionedStyles = (color: string, width: number) =>
  StyleSheet.create({
    send: {backgroundColor: '#68A0B4'},
    confirm: {
      backgroundColor: '#68A0B4',
      width: width / 5,
      marginHorizontal: 0,
    },
    warning: {color: 'red', fontWeight: 'bold'},
    back: {backgroundColor: '#7E8C9A', width: width / 5, marginHorizontal: 0},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    title: {fontWeight: 'bold', fontSize: 16},
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      phishingAccounts: state.phishingAccounts,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TokenSwap);
