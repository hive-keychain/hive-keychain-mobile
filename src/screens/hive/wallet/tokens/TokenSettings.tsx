import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadTokens} from 'actions/index';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect, useSelector} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {fields_primary_text_1} from 'src/styles/typography';
import {RootState} from 'store';
import {hiveEngineWebsiteURL} from 'utils/config';
import {translate} from 'utils/localize';
import TokenSettingsItem from './TokenSettingsItem';

const TokenSettings = ({loadTokens, tokens}: PropsFromRedux) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
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
      customHiddenTokens = JSON.parse(
        await AsyncStorage.getItem(KeychainStorageKeyEnum.HIDDEN_TOKENS),
      );
      setHiddenTokens(customHiddenTokens ?? []);
    } catch (error) {
      console.log('Error reading hiddenTokens');
    }
  };

  useEffect(() => {
    if (tokens.length) {
      setLoadingTokens(false);
      setFilteredTokens(tokens);
    }
  }, [tokens]);

  const toogleHiddenToken = async (symbol: string) => {
    let newHiddenTokens = hiddenTokens;
    if (hiddenTokens.includes(symbol)) {
      newHiddenTokens = newHiddenTokens.filter(
        (tokenName) => tokenName !== symbol,
      );
    } else {
      newHiddenTokens = [...newHiddenTokens, symbol];
    }
    setHiddenTokens(newHiddenTokens);
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.HIDDEN_TOKENS,
      JSON.stringify(newHiddenTokens),
    );
  };

  const handleResetHiddenTokens = async () => {
    setHiddenTokens([]);
    await AsyncStorage.removeItem(KeychainStorageKeyEnum.HIDDEN_TOKENS);
    setIsExpandedReset(false);
  };

  const {theme} = useThemeContext();
  const {height, width} = useWindowDimensions();
  const styles = getStyles(theme, height);
  const colors = useSelector((state: RootState) => state.colors);

  const renderTokenSettingsItem = useCallback(
    ({item}) => (
      <TokenSettingsItem
        token={item}
        theme={theme}
        heightDevice={height}
        widthDevice={width}
        checkedValue={!hiddenTokens.find((symbol) => symbol === item.symbol)}
        setChecked={() => toogleHiddenToken(item.symbol)}
        colors={colors}
      />
    ),
    [theme, height, width, hiddenTokens, toogleHiddenToken, colors],
  );

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar />
      <Separator height={10} />
      <Text style={styles.padding}>
        <Text style={[getCaptionStyle(width, theme)]}>
          {translate('wallet.operations.token_settings.tokens_settings_text')}{' '}
        </Text>
        <Text style={[getCaptionStyle(width, theme), styles.link]}>
          {hiveEngineWebsiteURL}{' '}
        </Text>
      </Text>
      <Separator height={10} />
      {/* {!loadingTokens && hiddenTokens.length > 0 && (
        <View style={styles.flexEnd}>
          <View>
            <Icon
              name={Icons.EXPAND_THIN}
              theme={theme}
              width={10}
              height={10}
              additionalContainerStyle={getRotateStyle(
                isExpandedReset ? '0' : '180',
              )}
              onClick={() => setIsExpandedReset(!isExpandedReset)}
            />
            {isExpandedReset && (
              <>
                <Icon
                  name={Icons.SEE}
                  theme={theme}
                  onClick={handleResetHiddenTokens}
                />
                <Text style={[styles.textBase, styles.smallText]}>
                  {translate(
                    'wallet.operations.token_settings.reset_tokens_text',
                  )}
                </Text>
              </>
            )}
          </View>
        </View>
      )} */}
      <Separator height={8} />
      {loadingTokens ? (
        <View style={styles.flexCentered}>
          <Loader animating size={'small'} />
        </View>
      ) : (
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
  };
};
const connector = connect(mapStateToProps, {
  loadTokens,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(TokenSettings);
