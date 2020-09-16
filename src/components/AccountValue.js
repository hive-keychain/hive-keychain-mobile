import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {getAccountValue} from 'utils/price';
import {withCommas} from 'utils/format';

const AccountValue = ({style, bittrex, user, properties}) => {
  let accountValue = 0;
  console.log(bittrex, user, properties, 'a');
  if (bittrex.btc && user.account && properties.globals) {
    console.log('go');
    accountValue = withCommas(
      getAccountValue(user.account, bittrex, properties.globals),
    );
  }
  return <Text style={style}>{`$ ${accountValue}`}</Text>;
};

const mapStateToProps = (state) => {
  return {
    user: state.activeAccount,
    bittrex: state.bittrex,
    properties: state.properties,
  };
};

export default connect(mapStateToProps)(AccountValue);
