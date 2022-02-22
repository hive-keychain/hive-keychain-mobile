import {Currency} from 'actions/interfaces';
import DelegationsList from 'components/operations/DelegationsList';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Width} from 'utils/common.types';
import {formatBalance, signedNumber} from 'utils/format';
import {navigate} from 'utils/navigation';

type Props = {
  name: string;
  logo: JSX.Element;
  currency: string;
  value: number;
  secondaryCurrency?: string;
  secondaryValue?: number;
  color: string;
  price?: Currency;
  incoming?: number;
  outgoing?: number;
  buttons: JSX.Element[];
  amountStyle?: StyleProp<TextStyle>;
  bottomLeft?: JSX.Element;
  toggled: boolean;
  setToggle: () => void;
};

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
  secondaryCurrency,
  secondaryValue,
  bottomLeft,
  toggled,
  setToggle,
}: Props) => {
  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
    change: price ? price.usd_24h_change! + '' : '0',
  });
  return (
    <TouchableOpacity style={styles.container} onPress={setToggle}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View>
          <Text style={amountStyle || styles.amount}>
            {value ? formatBalance(value) : 0}
            <Text style={styles.currency}>{` ${currency}`}</Text>
          </Text>
          {secondaryCurrency ? (
            <Text style={amountStyle || styles.amount}>
              {secondaryValue ? formatBalance(secondaryValue) : 0}
              <Text style={styles.currency}>{` ${secondaryCurrency}`}</Text>
            </Text>
          ) : null}
        </View>
      </View>
      {toggled && (
        <View style={[styles.row, styles.toggle]}>
          {bottomLeft
            ? bottomLeft
            : renderLeftBottom(styles, price, currency, incoming, outgoing)}
          <View style={[styles.row, styles.halfLine, styles.rowReverse]}>
            {buttons}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const renderLeftBottom = (
  styles: Styles,
  price: Currency,
  currency: string,
  incoming?: number,
  outgoing?: number,
) => {
  if (currency !== 'HP') {
    return (
      <View style={[styles.row, styles.halfLine]}>
        <Text style={styles.price}>{`$ ${price.usd.toFixed(2)}`}</Text>
        <Text style={styles.change}>{`${signedNumber(
          +price.usd_24h_change!.toFixed(2),
        )}%`}</Text>
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
              incoming!,
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
            <Text style={styles.red}>{`- ${formatBalance(outgoing!)} HP`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const getDimensionedStyles = ({
  width,
  color,
  change,
}: Width & {color: string; change: string}) =>
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
      alignSelf: 'flex-start',
    },
    logo: {justifyContent: 'center', alignItems: 'center'},
    name: {
      marginLeft: width * 0.03,
      fontSize: 15,
      color: '#7E8C9A',
    },
    amount: {fontWeight: 'bold', fontSize: 17, textAlign: 'right'},
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
    change: {color: +change > 0 ? '#3BB26E' : '#B9122F'},
    green: {color: '#3BB26E'},
    red: {color: '#B9122F'},
    halfLine: {width: '40%'},
    rowReverse: {flexDirection: 'row-reverse'},
  });
type Styles = ReturnType<typeof getDimensionedStyles>;

export default TokenDisplay;
