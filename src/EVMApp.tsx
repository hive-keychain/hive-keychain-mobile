import React from 'react';
import {View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';

const App = () => {
  return <View />;
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
