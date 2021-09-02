import Operation from 'components/operations/Operation';
import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default ({error, onClose}: {error: string; onClose: () => void}) => {
  return (
    <Operation title="ERROR" onClose={onClose}>
      <Text style={styles.text}>{error}</Text>
    </Operation>
  );
};

const styles = StyleSheet.create({text: {marginTop: 50}});
