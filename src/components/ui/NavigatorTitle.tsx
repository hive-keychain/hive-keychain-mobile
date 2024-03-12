import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {translate} from 'utils/localize';

type Props = {
  title: string;
  skipTranslation?: boolean;
};

export default ({title, skipTranslation}: Props) => {
  return (
    <Text style={styles.title}>
      {skipTranslation ? title : translate(title)}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
});
