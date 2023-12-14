import {loadUserTokens} from 'actions/index';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {translate} from 'utils/localize';

const EngineTokens = ({
  userTokens,
  tokensMarket,
  tokens,
  properties,
  user,
  loadUserTokens,
}: PropsFromRedux) => {
  const [toggled, setToggled] = useState<number>(null);
  const [
    orderedUserTokenBalanceList,
    setOrderedUserTokenBalanceList,
  ] = useState<TokenBalance[]>([]);

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  useEffect(() => {
    if (!userTokens.loading) {
      const list = userTokens.list.sort((a, b) => {
        return (
          getHiveEngineTokenValue(b, tokensMarket) -
          getHiveEngineTokenValue(a, tokensMarket)
        );
      });
      setOrderedUserTokenBalanceList(list);
    }
  }, [userTokens]);

  useEffect(() => {
    if (
      properties.globals &&
      Object.keys(properties.globals).length > 0 &&
      user.name &&
      !userTokens.loading
    ) {
      loadUserTokens(user.name);
    }
  }, [properties, user.name]);

  if (userTokens.loading || !tokensMarket?.length) {
    return (
      <View style={{height: 40}}>
        <Loader size={'small'} animating />
      </View>
    );
  } else if (!userTokens.loading && orderedUserTokenBalanceList?.length) {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{width: '100%', height: '100%'}}>
        <FlatList
          data={orderedUserTokenBalanceList}
          contentContainerStyle={styles.flatlist}
          keyExtractor={(item) => item._id.toString()}
          ItemSeparatorComponent={() => <Separator height={10} />}
          renderItem={({item}) => (
            <EngineTokenDisplay
              addBackground
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
          ListEmptyComponent={
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.no_tokens}>
                {translate('wallet.no_tokens')}
              </Text>
            </View>
          }
        />
      </ScrollView>
    );
  } else return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flatlist: {
      paddingBottom: 20,
    },
    no_tokens: {
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      ...button_link_primary_medium,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
      tokens: state.tokens,
      userTokens: state.userTokens,
      tokensMarket: state.tokensMarket,
    };
  },
  {
    loadUserTokens,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EngineTokens);
