import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {fields_primary_text_1} from 'src/styles/typography';
import {translate} from 'utils/localize';

export type LabelDataType = {
  label: string;
  data?: {[key: string]: string};
  color?: string;
};

type CustomAmountLabelProps = {
  list: [LabelDataType];
  translatePrefix: string;
  theme: Theme;
};

const CustomAmountLabel = ({
  list,
  translatePrefix,
  theme,
}: CustomAmountLabelProps) => {
  const applyRandomKey = () => {
    return Math.random().toFixed(6).toString();
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.rowContainer}>
      {list.map((listItem) => {
        return (
          <Text
            key={applyRandomKey()}
            style={[{color: listItem.color ?? 'black'}, styles.text]}>
            {translate(`${translatePrefix}.${listItem.label}`, listItem.data)}{' '}
          </Text>
        );
      })}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    text: {
      ...fields_primary_text_1,
      color: getColors(theme).secondaryText,
    },
  });

export default CustomAmountLabel;
