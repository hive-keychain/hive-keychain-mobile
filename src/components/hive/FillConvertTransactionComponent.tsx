import {ActiveAccount} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {FillConvert} from 'src/interfaces/transaction.interface';
import {Height} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  user: ActiveAccount;
  transaction: FillConvert;
  token?: boolean;
  locale: string;
  useIcon?: boolean;
};
const FillConvertTransactionComponent = ({
  transaction,
  user,
  locale,
  token = false,
  useIcon,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const username = user.name;
  const {timestamp, amount_in, amount_out} = transaction;
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

  const formattedAmountIn = withCommas(amount_in);
  const formattedAmountOut = withCommas(amount_out);

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
          <Text style={styles.username}>
            {translate('wallet.operations.convert.fill_convert_request')}{' '}
          </Text>
          <Text style={{color: '#B9122F'}}>
            {' '}
            {formattedAmountOut} {amount_out.split(' ')[1]}
          </Text>
          <Text> =&gt; </Text>
          <Text style={{color: color}}>
            {formattedAmountIn} {amount_in.split(' ')[1]}
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

export default FillConvertTransactionComponent;
