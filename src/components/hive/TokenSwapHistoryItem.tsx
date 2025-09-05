import Icon from 'components/hive/Icon';
import Clipboard from 'expo-clipboard';
import {ISwap, SwapStatus} from 'hive-keychain-commons';
import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Icons} from 'src/enums/icons.enums';
import {RootState} from 'store';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';

interface Props {
  swap: ISwap;
}

const TokenSwapHistoryItem = ({swap}: PropsFromRedux & Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyIdToCliplboard = (id: string) => {
    Clipboard.setStringAsync(id.toString());
    SimpleToast.show(translate('swapTokens.swap_copied_to_clipboard'), {
      duration: SimpleToast.durations.LONG,
    });
  };

  const getStatusMessage = (
    status: ISwap['status'],
    transferInitiated: boolean,
  ) => {
    switch (status) {
      case SwapStatus.PENDING:
        return transferInitiated
          ? translate('swapTokens.swap_status_pending')
          : translate('swapTokens.swap_transfer_not_sent');
      case SwapStatus.COMPLETED:
        return translate('swapTokens.swap_status_completed');
      case SwapStatus.CANCELED_DUE_TO_ERROR:
        return translate('swapTokens.swap_status_canceled_due_to_error');
      case SwapStatus.FUNDS_RETURNED:
        return translate('swapTokens.swap_status_returned');
      case SwapStatus.REFUNDED_SLIPPAGE:
        return translate('swapTokens.swap_status_refunded');
      case SwapStatus.STARTED:
        return translate('swapTokens.swap_status_started');
    }
  };

  const getStatusIcon = (status: ISwap['status']) => {
    switch (status) {
      case SwapStatus.PENDING:
      case SwapStatus.STARTED:
        return 'pending';
      case SwapStatus.COMPLETED:
        return 'check_circle';
      case SwapStatus.CANCELED_DUE_TO_ERROR:
      case SwapStatus.FUNDS_RETURNED:
      case SwapStatus.REFUNDED_SLIPPAGE:
        return 'error';
    }
  };

  const getShortenedId = (id: string) => {
    return id.substring(0, 6) + '...' + id.slice(-6);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'cancel';
      default:
        return 'pending';
    }
  };

  function getTooltipMessage(swap: ISwap) {
    return `${getStatusMessage(swap.status, swap.transferInitiated)} \n ${
      [SwapStatus.PENDING, SwapStatus.STARTED].includes(swap.status)
        ? translate('swapTokens.swap_last_update', {
            updatedAt: moment(swap.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
          })
        : moment(swap.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }`;
  }

  return (
    <View style={[styles.container, styles.paddingHorizontal]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f2d9d6',
          paddingVertical: 12,
        }}>
        <Icon
          name={!isOpen ? Icons.EXPAND_MORE : Icons.EXPAND_LESS}
          onPress={() => setIsOpen(!isOpen)}
        />
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              {swap.amount} {swap.startToken}
            </Text>
            <Icon name={Icons.POWER_UP_DOWN} subType={'withdraw_vesting'} />
            <Text>
              {swap.status === SwapStatus.COMPLETED ? '' : <Text>~</Text>}
              {swap.received ??
                withCommas(
                  Number(swap.expectedAmountAfterFee).toString(),
                  3,
                )}{' '}
              {swap.endToken}
            </Text>
          </View>
        </View>
        {/* <Tooltip
          containerStyle={{
            minHeight: 100,
          }}
          height={100}
          popover={
            <Text style={{textAlign: 'center'}}>{getTooltipMessage(swap)}</Text>
          }> */}
        <Icon name={getStatusIcon(swap.status) as Icons} />
        {/* </Tooltip> */}
      </View>

      {isOpen && (
        <>
          <View
            style={{
              marginTop: 8,
            }}>
            {swap.history
              .sort((a, b) => a.stepNumber - b.stepNumber)
              .map((step) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                  key={swap.id + '' + step.stepNumber}>
                  <Text
                    style={{
                      marginLeft: 12,
                      fontWeight: 'bold',
                    }}>
                    {step.stepNumber}
                  </Text>
                  <View>
                    <Text>
                      {withCommas(step.amountStartToken + '', 3)}{' '}
                      {step.startToken} {'=>'}{' '}
                      {step.amountEndToken
                        ? withCommas(step.amountEndToken + '', 3)
                        : '...'}{' '}
                      {step.endToken}
                    </Text>
                  </View>
                  <Icon name={getStepIcon(step.status) as Icons} />
                </View>
              ))}
            {!!swap.fee && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                <Text
                  style={{
                    marginLeft: 12,
                    fontWeight: 'bold',
                  }}>
                  {translate('swapTokens.swap_fee')}
                </Text>
                <View>
                  <Text>
                    {swap.fee} {swap.endToken}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text
                style={{
                  marginLeft: 12,
                  fontWeight: 'bold',
                }}>
                ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>{getShortenedId(swap.id)}</Text>
                <Icon
                  name={'content_copy' as Icons}
                  onPress={() => copyIdToCliplboard(swap.id)}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1, marginBottom: 8},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
  withdrawingValue: {color: '#b8343f', fontSize: 14},
  flexRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  send: {backgroundColor: '#68A0B4', marginBottom: 20},
  title: {fontWeight: 'bold', fontSize: 16},
});

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(TokenSwapHistoryItem);
