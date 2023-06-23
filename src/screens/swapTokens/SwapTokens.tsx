import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';

const SwapTokens = ({}: PropsFromRedux) => {
  return (
    <View style={styles.container}>
      <Text>Hi from future swap tokens feature</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
  withdrawingValue: {color: '#b8343f', fontSize: 14},
  flexRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SwapTokens);
