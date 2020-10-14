import React, {useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {loadTokens, loadUserTokens, loadTokensMarket} from 'actions';
import {connect} from 'react-redux';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Separator from 'components/ui/Separator';

const Tokens = ({
  user,
  loadTokensConnect,
  loadUserTokensConnect,
  loadTokensMarketConnect,
  tokens,
  userTokens,
  tokensMarket,
}) => {
  useEffect(() => {
    loadTokensConnect();
    loadTokensMarketConnect();
  }, [loadTokensConnect, loadTokensMarketConnect]);
  useEffect(() => {
    loadUserTokensConnect(user.name);
  }, [loadUserTokensConnect, user.name]);
  console.log(userTokens);
  return (
    <View style={styles.container}>
      <Separator />
      <FlatList
        style={[styles.half]}
        data={userTokens}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Separator height={10} />}
        renderItem={({item}) => (
          <EngineTokenDisplay
            token={item}
            tokensList={tokens}
            market={tokensMarket}
          />
        )}
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
    tokensMarket: state.tokensMarket,
  };
};

export default connect(mapStateToProps, {
  loadTokensConnect: loadTokens,
  loadUserTokensConnect: loadUserTokens,
  loadTokensMarketConnect: loadTokensMarket,
})(Tokens);
