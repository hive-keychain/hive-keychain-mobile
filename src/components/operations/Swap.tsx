import {showFloatingBar} from 'actions/floatingBar';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';

const Swap = ({showFloatingBar}: PropsFromRedux) => {
  useEffect(() => {
    showFloatingBar(false);
  }, []);

  return (
    <View>
      <Text>Swap TODO</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

const connector = connect(
  (state: RootState) => {
    return {};
  },
  {showFloatingBar},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Swap);
