import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadTokens, loadTokensMarket, loadUserTokens} from 'actions/index';
import CustomSearchBar from 'components/form/CustomSearchBar';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
// import {TemplateStackProps} from 'navigators/Root.types';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {DARKBLUELIGHTER, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_1,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {hiveEngineWebsiteURL} from 'utils/config';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

interface TokensProps {}
/**Note: Currently component not being called or used. */
const Tokens = ({
  user,
  loadTokens,
  loadUserTokens,
  loadTokensMarket,
  tokens,
  userTokens,
  prices,
  tokensMarket,
}: PropsFromRedux & TokensProps) => {
  const [filteredUserTokenBalanceList, setFilteredUserTokenBalanceList] =
    useState<TokenBalance[]>([]);
  const [search, setSearch] = useState<string>('');
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);

  useEffect(() => {
    loadHiddenTokens();
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

  useEffect(() => {
    if (!userTokens.loading) {
      const list = userTokens.list.sort((a, b) => {
        return (
          getHiveEngineTokenValue(b, tokensMarket) -
          getHiveEngineTokenValue(a, tokensMarket)
        );
      });
      setFilteredUserTokenBalanceList(
        list.filter((userToken) => !hiddenTokens.includes(userToken.symbol)),
      );
    }
  }, [userTokens]);

  useEffect(() => {
    const filtered = filteredUserTokenBalanceList.filter(
      (token) =>
        token.balance.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUserTokenBalanceList(
      filtered.filter(
        (filteredToken) => !hiddenTokens.includes(filteredToken.symbol),
      ),
    );
  }, [search]);

  const loadHiddenTokens = async () => {
    let customHiddenTokens = null;
    try {
      customHiddenTokens = JSON.parse(
        await AsyncStorage.getItem(KeychainStorageKeyEnum.HIDDEN_TOKENS),
      );
      setHiddenTokens(customHiddenTokens ?? []);
    } catch (error) {
      console.log('Error reading hiddenTokens');
    }
  };

  const {theme} = useThemeContext();

  const [toggled, setToggled] = useState<number>(null);

  const styles = getStyles(theme, useWindowDimensions());

  const renderEngineTokenDisplay = useCallback(
    ({item}: {item: TokenBalance}) => (
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
    ),
    [tokens, tokensMarket, toggled],
  );

  const renderContent = () => {
    if (userTokens.loading || !tokensMarket?.length) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      );
    } else if (filteredUserTokenBalanceList?.length) {
      return (
        <FlatList
          data={filteredUserTokenBalanceList}
          contentContainerStyle={styles.flatlist}
          keyExtractor={(item) => item._id.toString()}
          ItemSeparatorComponent={() => <Separator height={10} />}
          renderItem={renderEngineTokenDisplay}
          ListEmptyComponent={
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={styles.no_tokens}>
                {translate('wallet.no_tokens')}
              </Text>
            </View>
          }
        />
      );
    }
  };

  return (
    <Background theme={theme}>
      <View style={styles.containerTokenScreen}>
        <FocusAwareStatusBar />
        <Separator height={10} />
        <View style={styles.containerInfoText}>
          <Text style={[styles.textInfo, styles.textJustified]}>
            {translate('wallet.operations.tokens.info')}
          </Text>
        </View>
        <View style={styles.containerInfoText}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Linking.openURL(hiveEngineWebsiteURL)}>
            <Text style={[styles.textInfo, styles.textUnderlined]}>
              {hiveEngineWebsiteURL}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBarContainer}>
          <CustomSearchBar
            theme={theme}
            rightIcon={<Icon name={Icons.SEARCH} theme={theme} />}
            value={search}
            onChangeText={(text) => setSearch(text)}
            disabled={userTokens.loading === true}
            additionalContainerStyle={styles.searchBar}
          />
          <Icon
            name={Icons.SETTINGS_2}
            theme={theme}
            onPress={() => navigate('TokenSettings')}
            additionalContainerStyle={styles.iconButton}
          />
        </View>
        {renderContent()}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    flatlist: {paddingBottom: 20},
    no_tokens: {
      color: getColors(theme).secondaryText,
      marginVertical: 20,
      textAlign: 'center',
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
    },
    containerTokenScreen: {
      flex: 1,
    },
    containerInfoText: {
      padding: 10,
    },
    textInfo: {
      lineHeight: 22.05,
      ...body_primary_body_1,
      opacity: 0.6,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, body_primary_body_1.fontSize),
    },
    textUnderlined: {
      textDecorationLine: 'underline',
    },
    textJustified: {
      textAlign: 'justify',
    },
    iconButton: {
      borderRadius: 20,
      borderColor: theme === Theme.DARK ? DARKBLUELIGHTER : null,
      borderWidth: theme === Theme.DARK ? 1 : 0,
      backgroundColor: getColors(theme).cardBgLighter,
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 22,
      height: 22,
    },
    searchBarContainer: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 35,
      marginTop: 35,
    },
    searchBar: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? '80%' : '85%',
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
