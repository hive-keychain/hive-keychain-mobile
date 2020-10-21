import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {signedNumber, formatBalance} from 'utils/format';
import {navigate} from 'utils/navigation';
import DelegationsList from 'components/operations/DelegationsList';

const TokenDisplay = ({
  name,
  logo,
  currency,
  value,
  buttons,
  color,
  price,
  incoming,
  outgoing,
  amountStyle,
}) => {
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
        <Text style={amountStyle || styles.amount}>
          {formatBalance(value)}
          <Text style={styles.currency}>{` ${currency}`}</Text>
        </Text>
      </View>
      {toggle && (
        <View style={[styles.row, styles.toggle]}>
          {renderLeftBottom(styles, price, currency, incoming, outgoing)}
          <View style={[styles.row, styles.halfLine, styles.rowReverse]}>
            {buttons}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const renderLeftBottom = (styles, price, currency, incoming, outgoing) => {
  if (currency !== 'HP') {
    return (
      <View style={[styles.row, styles.halfLine]}>
        <Text style={styles.price}>{`$ ${price.Usd}`}</Text>
        <Text style={styles.change}>{`${signedNumber(price.DailyUsd)}%`}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.halfLine}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('ModalScreen', {
                modalContent: <DelegationsList type="incoming" />,
              });
            }}>
            <Text style={styles.green}>{`+ ${formatBalance(
              incoming,
            )} HP`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('ModalScreen', {
                modalContent: <DelegationsList type="outgoing" />,
              });
            }}>
            <Text style={styles.red}>{`- ${formatBalance(outgoing)} HP`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
    left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
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
    green: {color: '#3BB26E'},
    red: {color: '#B9122F'},
    halfLine: {width: '35%'},
    rowReverse: {flexDirection: 'row-reverse'},
  });

export default TokenDisplay;
