import analytics from '@react-native-firebase/analytics';
import {loadTokens, loadTokensMarket, loadUserTokens} from 'actions/index';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import HiveEngineAccountValue from 'components/hive/HiveEngineAccountValue';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';

const Tokens = ({
  user,
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
  tokens,
  userTokens,
  bittrex,
  tokensMarket,
}: PropsFromRedux) => {
  useEffect(() => {
    loadTokens();
    loadTokensMarket();
    analytics().logScreenView({
      screen_class: 'EngineWalletScreen',
      screen_name: 'EngineWalletScreen',
    });
  }, [loadTokens, loadTokensMarket]);
  useEffect(() => {
    console.log('logging engine');
    analytics().logScreenView({
      screen_class: 'EngineWalletScreen',
      screen_name: 'EngineWalletScreen',
    });
  }, []);
  useEffect(() => {
    if (user.name) {
      loadUserTokens(user.name);
    }
  }, [loadUserTokens, user.name]);

  const renderContent = () => {
    if (userTokens.loading) {
      return <Loader animating />;
    } else if (userTokens.list.length) {
      return (
        <FlatList
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

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    tokens: state.tokens,
    userTokens: state.userTokens,
    tokensMarket: state.tokensMarket,
    bittrex: state.bittrex,
  };
};
const connector = connect(mapStateToProps, {
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Tokens);
