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
import {sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {SwapTokenUtils} from 'utils/swap-token.utils';
import Operation from './Operation';

//TODO just befire finishing this up, check:
//  - what intefaces are available in /hive-keychain-commons & remove them from here + re-import using hive-key-chain-commons.
// do this: I guess, updating the extension swap branch -> then make all those changes in the mobile. Will do that tomorrow then

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

      if (success && success.hasOwnProperty('tx_id')) {
        await SwapTokenUtils.saveLastUsed(startToken?.value, endToken?.value);
        await SwapTokenUtils.setAsInitiated(estimateId);
        SimpleToast.show(
          translate('swapTokens.swap_sending_token_successful'),
          SimpleToast.LONG,
        );
        navigate('SwapTokensHistoryScreen');
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
