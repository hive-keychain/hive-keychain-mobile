import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';

const Signup = () => {
  return <Text>Signup</Text>;
};

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  console.log(state);
  return state;
};

export default connect(mapStateToProps)(Signup);
