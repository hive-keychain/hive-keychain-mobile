import {ActiveAccount} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {CollateralizedConvert} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';

type Props = {
  user: ActiveAccount;
  transaction: CollateralizedConvert;
  token?: boolean;
  locale: string;
};
const CollateralizedConvertTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <Text>{date}</Text>
          <Text style={styles.username}>Started Convertion:</Text>
        </View>

        <Text style={styles.amount}>{amount}</Text>
      </View>
      {toggle && (
        <Text>Successfully started a HBD collateralized conversion.</Text>
      )}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    left: {display: 'flex', flexDirection: 'row'},
    username: {paddingLeft: 10},
    amount: {color},
  });

export default CollateralizedConvertTransactionComponent;