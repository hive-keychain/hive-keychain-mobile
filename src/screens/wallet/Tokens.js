import React, {useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {loadTokens, loadUserTokens, loadTokensMarket} from 'actions';
import {connect} from 'react-redux';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Separator from 'components/ui/Separator';
import {translate} from 'utils/localize';
import HiveEngineAccountValue from 'components/hive/HiveEngineAccountValue';
const Tokens = ({
  user,
  loadTokensConnect,
  loadUserTokensConnect,
  loadTokensMarketConnect,
  tokens,
  userTokens,
  bittrex,
  tokensMarket,
}) => {
  useEffect(() => {
    loadTokensConnect();
    loadTokensMarketConnect();
  }, [loadTokensConnect, loadTokensMarketConnect]);
  useEffect(() => {
    loadUserTokensConnect(user.name);
  }, [loadUserTokensConnect, user.name]);
  return (
    <View style={styles.container}>
      <Separator />
      <HiveEngineAccountValue
        bittrex={bittrex}
        tokens={userTokens}
        tokensMarket={tokensMarket}
      />
      <Separator />

      {userTokens.length ? (
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
      ) : (
        <Text style={styles.no_tokens}>{translate('wallet.no_tokens')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  no_tokens: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    marginVertical: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.activeAccount,
    tokens: state.tokens,
    userTokens: state.userTokens,
    tokensMarket: state.tokensMarket,
    bittrex: state.bittrex,
  };
};

export default connect(mapStateToProps, {
  loadTokensConnect: loadTokens,
  loadUserTokensConnect: loadUserTokens,
  loadTokensMarketConnect: loadTokensMarket,
})(Tokens);
