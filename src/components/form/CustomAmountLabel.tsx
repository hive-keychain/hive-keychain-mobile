import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';

export type LabelAmount = {label: string; isAmount?: boolean};

type CustomAmountLabelProps = {
  //   amount: string;
  from: string;
  to: string;
  user: string;
  useTranslate?: boolean;
  list: LabelAmount[];
};

const CustomAmountLabel = ({
  //   amount,
  from,
  to,
  user,
  list,
  useTranslate,
}: CustomAmountLabelProps) => {
  //   const username = user.name;
  //   const other = from === username ? to : from;
  const direction = from === user ? '-' : '+';
  const color = direction === '+' ? '#3BB26E' : '#B9122F';
  const styles = getStyle(color);
  return (
    <View style={styles.rowContainer}>
      {list.map((item) => {
        return !item.isAmount ? (
          <Text key={item.label}>
            {useTranslate ? translate(item.label) : item.label}{' '}
          </Text>
        ) : (
          <Text key={item.label} style={styles.amount}>
            {`${direction} ${withCommas(item.label)} ${
              item.label.split(' ')[1]
            }`}{' '}
          </Text>
        );
      })}
    </View>
  );
};

const getStyle = (color: string) =>
  StyleSheet.create({
    amount: {color},
    rowContainer: {
      flexDirection: 'row',
    },
  });

export default CustomAmountLabel;
