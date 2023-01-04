import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';

export type LabelDataType = {
  label: string;
  data?: {[key: string]: string};
  color?: string;
};

type CustomAmountLabelProps = {
  list: [LabelDataType];
  translatePrefix: string;
};

const CustomAmountLabel = ({list, translatePrefix}: CustomAmountLabelProps) => {
  const applyRandomKey = () => {
    return Math.random().toFixed(6).toString();
  };

  return (
    <View style={styles.rowContainer}>
      {list.map((listItem) => {
        return listItem.data && listItem.data.hasOwnProperty('amount') ? (
          <View key={applyRandomKey()} style={styles.rowContainer}>
            <Text style={{color: listItem.color ?? 'black'}}>
              {translate(`${translatePrefix}.${listItem.label}`, {
                amount: withCommas(listItem.data.amount.split(' ')[0]),
              })}{' '}
            </Text>
            <Text style={{color: listItem.color ?? 'black'}}>
              {listItem.data.amount.split(' ')[1]}{' '}
            </Text>
          </View>
        ) : (
          <Text
            key={applyRandomKey()}
            style={{color: listItem.color ?? 'black'}}>
            {translate(`${translatePrefix}.${listItem.label}`, listItem.data)}{' '}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
});

export default CustomAmountLabel;
