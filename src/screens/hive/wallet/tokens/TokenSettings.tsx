import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadTokens} from 'actions/index';
import CustomSearchBar from 'components/form/CustomSearchBar';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import RpcErrorBanner from 'components/ui/RpcErrorBanner';
import Separator from 'components/ui/Separator';
import {useAppSelector} from 'hooks/redux';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {HiddenTokens, Token} from 'src/interfaces/tokens.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {fields_primary_text_1} from 'src/styles/typography';
import {hiveEngineWebsiteURL} from 'utils/config.utils';
import {getHiddenTokens} from 'utils/hiveEngine.utils';
import {translate} from 'utils/localize';
import TokenSettingsItem from './TokenSettingsItem';

const TokenSettings = ({
  loadTokens,
  tokens,
  userTokens,
  username,
  hiveEngineRpcError,
}: PropsFromRedux) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<HiddenTokens>({});
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [isExpandedReset, setIsExpandedReset] = useState(false);

  useEffect(() => {
    setLoadingTokens(true);
    loadHiddenTokens();
    loadTokens();
  }, []);

  useEffect(() => {
    const currentTokens = [...tokens];
    setFilteredTokens(
      currentTokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
          token.issuer.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  }, [searchValue]);

  const loadHiddenTokens = async () => {
    let customHiddenTokens = null;
    try {
      customHiddenTokens = await getHiddenTokens();
      setHiddenTokens(customHiddenTokens);
    } catch (error) {
      console.log('Error reading hiddenTokens');
    }
  };

  useEffect(() => {
    if (tokens.length) {
      setLoadingTokens(false);
      setFilteredTokens(
        tokens.filter((token) =>
          userTokens.list.some(
            (userToken) => userToken.symbol === token.symbol,
          ),
        ),
      );
    } else if (hiveEngineRpcError) {
      // Stop loading if there's an RPC error
      setLoadingTokens(false);
    }
  }, [tokens, userTokens.list, hiveEngineRpcError]);

  const toggleHiddenToken = async (symbol: string) => {
    let newHiddenTokens = hiddenTokens;
    if (hiddenTokens[username]?.includes(symbol)) {
      newHiddenTokens[username] = newHiddenTokens[username].filter(
        (tokenName) => tokenName !== symbol,
      );
    } else {
      newHiddenTokens[username] = [
        ...(newHiddenTokens[username] || []),
        symbol,
      ];
    }
    setHiddenTokens({...newHiddenTokens});
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.HIDDEN_TOKENS,
      JSON.stringify(newHiddenTokens),
    );
  };

  const handleResetHiddenTokens = async () => {
    setHiddenTokens({});
    await AsyncStorage.removeItem(KeychainStorageKeyEnum.HIDDEN_TOKENS);
    setIsExpandedReset(false);
  };

  const {theme} = useThemeContext();
  const {height, width} = useWindowDimensions();
  const styles = getStyles(theme, height);
  const colors = useAppSelector((state) => state.colors);

  const renderTokenSettingsItem = useCallback(
    ({item}: {item: Token}) => (
      <TokenSettingsItem
        token={item}
        theme={theme}
        heightDevice={height}
        widthDevice={width}
        checkedValue={!hiddenTokens[username]?.includes(item.symbol)}
        setChecked={() => toggleHiddenToken(item.symbol)}
        colors={colors}
      />
    ),
    [theme, height, width, hiddenTokens, toggleHiddenToken, colors],
  );
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar />

      {hiveEngineRpcError ? (
        <View style={styles.flexCentered}>
          <RpcErrorBanner errorMessageKey={hiveEngineRpcError} />
        </View>
      ) : loadingTokens ? (
        <View style={styles.flexCentered}>
          <Loader animating size={'small'} />
        </View>
      ) : (
        <>
          <Separator height={10} />
          <Text style={styles.padding}>
            <Text style={[getCaptionStyle(width, theme)]}>
              {translate(
                'wallet.operations.token_settings.tokens_settings_text',
              )}{' '}
            </Text>
            <Text style={[getCaptionStyle(width, theme), styles.link]}>
              {hiveEngineWebsiteURL}{' '}
            </Text>
          </Text>
          <Separator height={10} />
          <CustomSearchBar
            theme={theme}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            additionalContainerStyle={styles.searchBar}
          />

          <Separator height={8} />
          <FlatList
            data={filteredTokens}
            renderItem={renderTokenSettingsItem}
            ListEmptyComponent={
              <View style={[styles.containerCentered, styles.marginTop]}>
                <Text style={[styles.textBase]}>
                  {translate('wallet.operations.token_settings.empty_results')}
                </Text>
              </View>
            }
            ListFooterComponent={() => (
              <Separator height={initialWindowMetrics.insets.bottom} />
            )}
          />
        </>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    textBase: {
      ...fields_primary_text_1,
      color: getColors(theme).secondaryText,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: getColors(theme).primaryBackground,
    },
    iconLink: {
      width: 12,
      height: 12,
    },
    link: {
      color: PRIMARY_RED_COLOR,
      textDecorationStyle: 'solid',
      textDecorationColor: PRIMARY_RED_COLOR,
      textDecorationLine: 'underline',
    },
    searchBar: {
      width: '100%',
      height: 40,
    },
    flexCentered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    marginTop: {
      marginTop: 30,
    },
    flexEnd: {
      justifyContent: 'flex-end',
      width: '100%',
      flexDirection: 'row',
    },
    smallText: {
      fontSize: 9,
    },
    padding: {
      paddingHorizontal: 10,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    tokens: state.tokens,
    userTokens: state.userTokens,
    username: state.activeAccount?.name,
    hiveEngineRpcError: state.settings.hiveEngineRpcError,
  };
};
const connector = connect(mapStateToProps, {
  loadTokens,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TokenSettings);
