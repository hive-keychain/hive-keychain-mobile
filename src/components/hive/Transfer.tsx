import {ActiveAccount} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Transfer as TransferInterface} from 'src/interfaces/transaction.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {fields_primary_text_1} from 'src/styles/typography';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: TransferInterface;
  locale: string;
  useIcon: boolean;
  theme: Theme;
  token?: boolean;
};
const Transfer = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
  theme,
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
      <Icon name="expand_thin" theme={theme} />
    ) : (
      <Icon name="expand_thin" theme={theme} />
    );
  };

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
    theme,
  });

  return (
    <TouchableOpacity
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={[styles.row, styles.alignedContent]}>
          {useIcon && <Icon name={transaction.type} />}
          <Text style={styles.textBase}>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Text
              style={[
                styles.textBase,
                styles.username,
              ]}>{`${operationDetails.action} `}</Text>
            <Text
              style={[
                styles.textBase,
                styles.amount,
              ]}>{`${direction} ${withCommas(amount)} ${
              amount.split(' ')[1]
            }`}</Text>
            <Text style={[styles.textBase, styles.username]}>
              {` ${operationDetails.actionFromTo} `} {`@${other}`}
            </Text>
          </View>
          <View>{memo && memo.length ? toggleExpandMoreIcon() : null}</View>
        </View>
      </View>
      {toggle && memo && memo.length ? (
        <Text style={styles.textBase}>{memo}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({
  height,
  color,
  theme,
}: Height & {color: string; theme: Theme}) =>
  //TODO clean up styles & adjust as design
  StyleSheet.create({
    container: {
      borderRadius: 20,
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
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
  });

export default Transfer;
