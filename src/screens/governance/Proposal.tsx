import {ActiveAccount} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';

type Props = {
  user: ActiveAccount;
};

const Proposal = ({user}: PropsFromRedux & Props) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
});

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Proposal);
