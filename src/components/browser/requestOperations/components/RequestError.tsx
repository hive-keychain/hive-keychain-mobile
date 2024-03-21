import Operation from 'components/operations/Operation';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {body_primary_body_3} from 'src/styles/typography';

export default ({error, onClose}: {error: string; onClose: () => void}) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  return (
    <Operation title="ERROR" onClose={onClose}>
      <Text style={[styles.textBase, styles.text]}>{error}</Text>
    </Operation>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
    },
    text: {marginTop: 50, paddingHorizontal: 15},
  });
