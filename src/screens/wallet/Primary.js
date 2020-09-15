import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import AccountValue from 'components/AccountValue';
const Primary = ({account}) => {
  return (
    <View>
      <AccountValue account={account} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Primary;
