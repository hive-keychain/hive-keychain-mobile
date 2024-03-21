import React from 'react';
import {ScaledSize, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

export default ({code, theme}: {code: string[]; theme: Theme}) => {
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <View style={styles.container}>
      {Array.from(Array(6)).map((e, i) => {
        const fill =
          i >= code.length ? 'transparent' : getColors(theme).secondaryText;
        return (
          <View key={i} style={{...styles.indicator, backgroundColor: fill}} />
        );
      })}
    </View>
  );
};

const getDimensionedStyles = ({width}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '60%',
      justifyContent: 'space-evenly',
      alignContent: 'center',
    },
    indicator: {
      backgroundColor: 'transparent',
      width: width / 20,
      height: width / 20,
      borderRadius: width / 40,
      borderColor: getColors(theme).secondaryText,
      borderWidth: 1,
      opacity: theme === Theme.LIGHT ? 0.7 : 1,
    },
  });
