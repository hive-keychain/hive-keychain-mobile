import React, {useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {loadTokens, loadUserTokens, loadTokensMarket} from 'actions';
import {connect} from 'react-redux';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Separator from 'components/ui/Separator';
import {translate} from 'utils/localize';
import HiveEngineAccountValue from 'components/hive/HiveEngineAccountValue';
import Loader from 'components/ui/Loader';

const Tokens = ({
  user,
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
  tokens,
  userTokens,
  bittrex,
  tokensMarket,
}) => {
  useEffect(() => {
    loadTokens();
    loadTokensMarket();
  }, [loadTokens, loadTokensMarket]);

  useEffect(() => {
    loadUserTokens(user.name);
  }, [loadUserTokens, user.name]);

  const renderContent = () => {
    if (userTokens.loading) {
      return <Loader animating />;
    } else if (userTokens.list.length) {
      return (
        <FlatList
          style={[styles.half]}
          data={userTokens.list}
          keyExtractor={(item) => item._id.toString()}
          ItemSeparatorComponent={() => <Separator height={10} />}
          renderItem={({item}) => (
            <EngineTokenDisplay
              token={item}
              tokensList={tokens}
              market={tokensMarket}
            />
          )}
        />
      );
    } else {
      return (
        <Text style={styles.no_tokens}>{translate('wallet.no_tokens')}</Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Separator />
      <HiveEngineAccountValue
        bittrex={bittrex}
        tokens={userTokens.list}
        tokensMarket={tokensMarket}
      />
      <Separator />
      {renderContent()}
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
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
})(Tokens);
