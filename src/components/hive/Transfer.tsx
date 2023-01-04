import {ActiveAccount} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Icons} from 'src/enums/icons.enums';
import {Transfer as TransferInterface} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: TransferInterface;
  token?: boolean;
  locale: string;
  useIcon: boolean;
};
const Transfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, from, to, amount, memo} = transaction;
  const other = from === username ? to : from;
  const direction = from === username ? '-' : '+';
  const color = direction === '+' ? '#3BB26E' : '#B9122F';
  const operationDetails = {
    action:
      direction === '+'
        ? translate('wallet.operations.transfer.received')
        : translate('wallet.operations.transfer.sent'),
    actionFromTo:
      direction === '+'
        ? translate('wallet.operations.transfer.confirm.from')
        : translate('wallet.operations.transfer.confirm.to'),
  };
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={[styles.row, styles.alignedContent]}>
          {useIcon && <Icon name={transaction.type} />}
          <Text>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Text style={styles.username}>{`${operationDetails.action} `}</Text>
            <Text style={styles.amount}>{`${direction} ${withCommas(amount)} ${
              amount.split(' ')[1]
            }`}</Text>
            <Text style={styles.username}>
              {` ${operationDetails.actionFromTo} `} {`@${other}`}
            </Text>
          </View>
          <View>{memo && memo.length ? toggleExpandMoreIcon() : null}</View>
        </View>
      </View>
      {toggle && memo && memo.length ? <Text>{memo}</Text> : null}
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
    main: {
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
      justifyContent: 'space-between',
    },
    alignedContent: {
      alignItems: 'center',
    },
  });

export default Transfer;
