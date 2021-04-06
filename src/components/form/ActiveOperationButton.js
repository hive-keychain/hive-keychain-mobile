import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import EllipticButton from './EllipticButton';
import {connect} from 'react-redux';
import {translate} from 'utils/localize';
import Icon from 'assets/addAccount/icon_info.svg';

const ActiveOperationButton = ({method, ...props}) => {
  return (
    <>
      {!props.user.keys[method || 'active'] && (
        <View style={styles.container}>
          <Icon fill="#A3112A" height={20} />
          <Text style={styles.text}>{translate('wallet.add_active')}</Text>
        </View>
      )}
      <EllipticButton
        {...props}
        disabled={!props.user.keys[method || 'active']}
      />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#A3112A',
    textAlign: 'center',
    fontSize: 13,
  },
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default connect((state) => {
  return {user: state.activeAccount};
})(ActiveOperationButton);
