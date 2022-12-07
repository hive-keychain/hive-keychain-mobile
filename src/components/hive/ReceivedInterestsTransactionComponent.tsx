import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {ReceivedInterests} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: ReceivedInterests;
  token?: boolean;
  locale: string;
  useIcon?: boolean;
};
const ReceivedInterestTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
}: Props) => {
  const username = user.name;
  const {timestamp, interest} = transaction;
  const color = '#3BB26E';
  const date = new Date(
    token ? ((timestamp as unknown) as number) * 1000 : timestamp,
  ).toLocaleDateString([locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    color,
  });

  return (
    <TouchableOpacity style={styles.container}>
      {/* <View style={styles.main}>
        <View style={styles.left}>
          {useIcon && <Icon name={transaction.type} />}
          <Text>{date}</Text>
        </View>
        <Text style={styles.amount}>
          {translate('wallet.operations.savings.info_received_interests', {
            amount: withCommas(interest),
            currency: 'HBD',
          })}
        </Text>
      </View> */}
      <View style={styles.main}>
        <View style={[styles.row, styles.alignedContent]}>
          {useIcon && <Icon name={transaction.type} />}
          <Text>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.username}>
            {translate('wallet.operations.savings.info_received_interests', {
              amount: withCommas(interest),
              currency: 'HBD',
            })}
          </Text>
        </View>
      </View>
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
    left: {display: 'flex', flexDirection: 'row'},
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

export default ReceivedInterestTransactionComponent;
