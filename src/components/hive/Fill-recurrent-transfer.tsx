import {ActiveAccount, Transaction} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icons} from 'src/enums/icons.enums';
import {FillRecurrentTransfer as FillRecurrentTransferInterface} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: Transaction;
  token?: boolean;
  locale: string;
  useIcon?: boolean;
};

const FillRecurrentTransfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {
    timestamp,
    from,
    to,
    amount,
    memo,
    remainingExecutions,
  } = transaction as FillRecurrentTransferInterface;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const color = direction === '+' ? '#3BB26E' : '#B9122F';
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const toggleExpandMoreIcon = () => {
    return toggle ? (
      <Icon name={Icons.EXPAND_LESS} />
    ) : (
      <Icon name={Icons.EXPAND_MORE} />
    );
  };

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
  });

  const formattedAmount = withCommas(amount);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.columnContainer}>
        <View style={[styles.row, styles.alignedContent]}>
          <View
            style={[
              styles.row,
              {width: '100%', justifyContent: 'space-between'},
            ]}>
            <View style={styles.row}>
              {useIcon && <Icon name={transaction.type} />}
              <Text>{date}</Text>
            </View>
            <View>{memo && memo.length ? toggleExpandMoreIcon() : null}</View>
          </View>
        </View>
        <View style={styles.rowContainer}>
          {direction === '+' ? (
            <View style={styles.columnContainer}>
              <View style={styles.rowContainer}>
                <Text>Received</Text>
                <Text style={{color}}>
                  {' '}
                  {direction}
                  {formattedAmount} {amount.split(' ')[1]}
                </Text>
              </View>
              <Text>
                {translate(
                  'wallet.operations.transfer.fill_recurrent_transfer_in',
                  {other, remainingExecutions},
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.columnContainer}>
              <View style={styles.rowContainer}>
                <Text>Sent</Text>
                <Text style={{color}}>
                  {' '}
                  {direction}
                  {formattedAmount} {amount.split(' ')[1]}
                </Text>
              </View>
              <Text>
                {translate(
                  'wallet.operations.transfer.fill_recurrent_transfer_out',
                  {other, remainingExecutions},
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
      {toggle && memo && memo.length ? (
        <View>
          <Text>{memo}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({height, color}: Height & {color: string}) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderColor: 'black',
      padding: height * 0.01,
    },
    columnContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    username: {},
    amount: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    alignedContent: {
      alignItems: 'center',
    },
  });

export default FillRecurrentTransfer;
