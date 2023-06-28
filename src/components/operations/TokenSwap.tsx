import ActiveOperationButton from 'components/form/ActiveOperationButton';
import {SelectOption} from 'components/form/CustomSelector';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {withCommas} from 'utils/format';
import {tryConfirmTransaction} from 'utils/hiveEngine';
import {sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import Operation from './Operation';

//TODO just befire finishing this up, check:
//  - what intefaces are available in /hive-keychain-commons & remove them from here + re-import using hive-key-chain-commons.

//TODO clean up
//TODO add styles to const styles

type TokenSwapOperationProps = {
  estimateId: string;
  startToken: SelectOption;
  endToken: SelectOption;
  amount: string;
  swapAccount: string;
  slippage: number;
  estimateValue: string;
  startTokenPrecision: any;
  endTokenPrecision: any;
};
type Props = PropsFromRedux & TokenSwapOperationProps;
const TokenSwap = ({
  estimateId,
  startToken,
  endToken,
  slippage,
  amount,
  swapAccount,
  estimateValue,
  startTokenPrecision,
  endTokenPrecision,
  user,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onSendSwap = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      let success;
      success = await SwapTokenUtils.processSwap(
        estimateId,
        startToken?.value.symbol,
        parseFloat(amount),
        user,
        sanitizeUsername(swapAccount),
      );
      console.log({success}); //TODO remove line

      if (success && success.hasOwnProperty('tx_id')) {
        const {confirmed} = await tryConfirmTransaction((success as any).tx_id);
        console.log({confirmed});

        await SwapTokenUtils.saveLastUsed(startToken?.value, endToken?.value);

        // await SwapTokenUtils.setAsInitiated(estimateId); //TODO ask cedric/quentin what to do here??
        if (confirmed) {
          SimpleToast.show(
            translate('swapTokens.swap_sending_token_successful'),
            SimpleToast.LONG,
          );
        } else {
          SimpleToast.show(
            translate('toast.transfer_token_unconfirmed'),
            SimpleToast.LONG,
          );
        }
        //TODO swap history page first.
        goBack(); //While coding
        // goBackToThenNavigate(Screen.TOKENS_SWAP_HISTORY);
      } else {
        SimpleToast.show(
          translate('swapTokens.swap_error_sending_token', {
            account: swapAccount,
          }),
          SimpleToast.LONG,
        );
      }
    } catch (err) {
      SimpleToast.show(err.message, SimpleToast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(height);

  return (
    <Operation
      logo={<Icon name="currency_exchange" />}
      title={translate('swapTokens.swap_token_confirm_title')}>
      <ScrollView>
        <Separator height={30} />
        <Text>{translate('swapTokens.swap_token_confirm_message')}</Text>
        <Separator />
        <Text style={styles.title}>{translate('swapTokens.swap_id')}</Text>
        <Text>{estimateId}</Text>
        <Separator />
        <Text style={styles.title}>{translate('swapTokens.swap_amount')}</Text>
        <Text>{`${withCommas(Number(amount).toFixed(startTokenPrecision))} ${
          startToken?.value.symbol
        } => ${withCommas(estimateValue!.toString())} ${
          endToken?.value.symbol
        }`}</Text>

        <Separator />
        <Text style={styles.title}>
          {translate('swapTokens.swap_slipperage')}
        </Text>
        <Text>{translate('swapTokens.swap_slippage', {slippage})}</Text>
        <Text></Text>
        <Separator height={40} />
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            style={styles.back}
            onPress={() => goBack()}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={onSendSwap}
            style={styles.confirm}
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </Operation>
  );
};

const getDimensionedStyles = (width: number) =>
  StyleSheet.create({
    send: {backgroundColor: '#68A0B4'},
    confirm: {
      backgroundColor: '#68A0B4',
      width: width / 5,
      marginHorizontal: 0,
    },
    warning: {color: 'red', fontWeight: 'bold'},
    back: {backgroundColor: '#7E8C9A', width: width / 5, marginHorizontal: 0},
    title: {fontWeight: 'bold', fontSize: 16},
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TokenSwap);
