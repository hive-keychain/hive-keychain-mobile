import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {signedNumber, formatBalance} from 'utils/format';

const TokenDisplay = ({name, logo, currency, value, buttons, color, price}) => {
  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
    change: price.DailyUsd,
  });
  const [toggle, setToggle] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setToggle(!toggle);
      }}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.amount}>
          {formatBalance(value)}
          <Text style={styles.currency}>{` ${currency}`}</Text>
        </Text>
      </View>
      {toggle && (
        <View style={[styles.row, styles.toggle]}>
          <View style={[styles.row, styles.halfLine]}>
            <Text style={styles.price}>{`$ ${price.Usd}`}</Text>
            <Text style={styles.change}>{`${signedNumber(
              price.DailyUsd,
            )}%`}</Text>
          </View>
          <View style={[styles.row, styles.halfLine, styles.rowReverse]}>
            {buttons}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width, height, color, change}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 2,
      borderColor: color,
      borderRadius: 10,
      width: '100%',
      backgroundColor: 'white',
      paddingHorizontal: width * 0.05,
      paddingVertical: width * 0.03,
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {display: 'flex', flexDirection: 'row'},
    logo: {justifyContent: 'center', alignItems: 'center'},
    name: {
      marginLeft: width * 0.03,
      fontSize: 15,
      color: '#7E8C9A',
    },
    amount: {fontWeight: 'bold', fontSize: 17},
    currency: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggle: {
      marginTop: width * 0.03,
    },
    price: {fontSize: 15, color: '#7E8C9A', fontWeight: 'bold'},
    change: {color: change > 0 ? '#3BB26E' : '#B9122F'},
    halfLine: {width: '35%'},
    rowReverse: {flexDirection: 'row-reverse'},
  });

export default TokenDisplay;
