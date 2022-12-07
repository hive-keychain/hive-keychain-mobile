import {ActiveAccount} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {PowerDown} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: PowerDown;
  token?: boolean;
  locale: string;
  useIcon?: boolean;
};

const PowerDownTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, amount} = transaction;
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

  const formattedAmount = withCommas(amount);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={[styles.row, styles.alignedContent]}>
          {useIcon && (
            <Icon name={transaction.type} subType={transaction.subType} />
          )}
          <Text>{date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.username}>
            {parseFloat(formattedAmount) === 0
              ? translate('wallet.operations.powerdown.cancelled_power_down')
              : translate('wallet.operations.powerdown.info_power_down', {
                  amount: formattedAmount,
                  currency: 'HP',
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

export default PowerDownTransactionComponent;
