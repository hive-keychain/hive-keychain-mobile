import React from 'react';
import {Text, StyleSheet} from 'react-native';
import EllipticButton from './EllipticButton';
import {connect} from 'react-redux';
import Icon from 'assets/addAccount/icon_info.svg';

const ActiveOperationButton = (props) => {
  return (
    <>
      {!props.user.keys.active && (
        <>
          <Icon fill="red" style={styles.text} />
          <Text style={styles.text}>
            Please add your active key to perform the operation.
          </Text>
        </>
      )}
      <EllipticButton {...props} disabled={!props.user.keys.active} />
    </>
  );
};

const styles = StyleSheet.create({
  text: {color: '#A3112A', marginBottom: -25, textAlign: 'center'},
});

export default connect((state) => {
  return {user: state.activeAccount};
})(ActiveOperationButton);
