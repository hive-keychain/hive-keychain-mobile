import React, {useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {loadTokens, loadUserTokens} from 'actions';
import {connect} from 'react-redux';

const Tokens = ({
  user,
  loadTokensConnect,
  loadUserTokensConnect,
  tokens,
  userTokens,
}) => {
  useEffect(() => {
    loadTokensConnect();
  }, [loadTokensConnect]);
  useEffect(() => {
    loadUserTokensConnect(user.name);
  }, [loadUserTokensConnect, user.name]);
  console.log(userTokens);
  return (
    <View style={styles.container}>
      <FlatList
        style={[styles.half]}
        data={userTokens}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => <Text>{item.symbol}</Text>}
      />
      <View style={[styles.half]}>
        <Text>Tokens</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({container: {flex: 1}, half: {flex: 0.5}});

const mapStateToProps = (state) => {
  return {
    user: state.activeAccount,
    tokens: state.tokens,
    userTokens: state.userTokens,
  };
};

export default connect(mapStateToProps, {
  loadTokensConnect: loadTokens,
  loadUserTokensConnect: loadUserTokens,
})(Tokens);
