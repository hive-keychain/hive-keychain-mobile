import React from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {lock} from '../actions';

const Main = ({lockConnect}) => {
  return (
    <>
      <Text h3 style={styles.textCentered}>
        Main
      </Text>
      <Button title="Lock" onPress={lockConnect} />
    </>
  );
};

const styles = StyleSheet.create({
  textCentered: {textAlign: 'center'},
});

export default connect(
  (state) => {
    console.log(state);
    return {a: 1};
  },
  {lockConnect: lock},
)(Main);
