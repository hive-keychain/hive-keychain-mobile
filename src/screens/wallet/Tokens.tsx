import {loadTokens, loadTokensMarket, loadUserTokens} from 'actions/index';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import HiveEngineAccountValue from 'components/hive/HiveEngineAccountValue';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {translate} from 'utils/localize';

const Tokens = ({
  user,
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
  tokens,
  userTokens,
  prices,
  tokensMarket,
}: PropsFromRedux) => {
  useEffect(() => {
    loadTokens();
    loadTokensMarket();
  }, [loadTokens, loadTokensMarket]);
  useEffect(() => {
    logScreenView('EngineWalletScreen');
  }, []);
  useEffect(() => {
    if (user.name) {
      loadUserTokens(user.name);
    }
  }, [loadUserTokens, user.name]);
  const [toggled, setToggled] = useState<number>(null);

  const renderContent = () => {
    if (userTokens.loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      );
    } else if (userTokens.list.length) {
      return (
        <FlatList
          data={userTokens.list}
          contentContainerStyle={styles.flatlist}
          keyExtractor={(item) => item._id.toString()}
          ItemSeparatorComponent={() => <Separator height={10} />}
          renderItem={({item}) => (
            <EngineTokenDisplay
              token={item}
              tokensList={tokens}
              market={tokensMarket}
              toggled={toggled === item._id}
              setToggle={() => {
                if (toggled === item._id) setToggled(null);
                else setToggled(item._id);
              }}
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
        prices={prices}
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
  flatlist: {paddingBottom: 20},
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
    prices: state.currencyPrices,
  };
};
const connector = connect(mapStateToProps, {
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Tokens);
