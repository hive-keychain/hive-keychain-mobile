import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUserTokens} from 'actions/index';
import HiveEngineLogo from 'assets/new_UI/hive-engine.svg';
import CustomSearchBar from 'components/form/CustomSearchBar';
import EngineTokenDisplay from 'components/hive/EngineTokenDisplay';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
// import {TemplateStackProps} from 'navigators/Root.types';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {getHiveEngineTokenValue} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

interface Props {
  showEngineTokenSettings: boolean;
}

const EngineTokens = ({
  userTokens,
  tokensMarket,
  tokens,
  properties,
  user,
  loadUserTokens,
  showEngineTokenSettings,
}: Props & PropsFromRedux) => {
  const [toggled, setToggled] = useState<number>(null);
  const [orderedUserTokenBalanceList, setOrderedUserTokenBalanceList] =
    useState<TokenBalance[]>([]);
  const [filteredUserTokenBalanceList, setFilteredUserTokenBalanceList] =
    useState<TokenBalance[]>([]);
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const flatListRef = useRef<FlatList<TokenBalance>>(null);

  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());

  useEffect(() => {
    if (!userTokens.loading) {
      let list = userTokens.list.sort((a, b) => {
        return (
          getHiveEngineTokenValue(b, tokensMarket) -
          getHiveEngineTokenValue(a, tokensMarket)
        );
      });
      setFilteredUserTokenBalanceList(
        list.filter((userToken) => !hiddenTokens.includes(userToken.symbol)),
      );
      setOrderedUserTokenBalanceList(list);
    }
  }, [userTokens, hiddenTokens]);

  useEffect(() => {
    const filtered = orderedUserTokenBalanceList.filter(
      (token) =>
        token.balance.toLowerCase().includes(searchValue.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilteredUserTokenBalanceList(
      filtered.filter(
        (filteredToken) => !hiddenTokens.includes(filteredToken.symbol),
      ),
    );
  }, [searchValue]);

  useEffect(() => {
    if (!userTokens.loading) {
      loadHiddenTokens();
      loadUserTokens(user.name);
    }
  }, [properties, user.name]);

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

  const handleClickSettings = () => {
    navigate('TokenSettings');
  };

  const handleClickToView = (itemIndex: number) => {
    if (flatListRef && flatListRef.current) {
      (flatListRef.current as FlatList).scrollToIndex({
        animated: true,
        index: itemIndex,
        viewPosition: 0,
      });
    }
  };

  const renderEngineTokenDisplay = useCallback(
    ({item}: {item: TokenBalance}) => (
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
    ),
    [tokens, tokensMarket, toggled],
  );

  if (userTokens.loading || !tokensMarket?.length) {
    return (
      <View style={{height: 40}}>
        <Loader size={'small'} animating />
      </View>
    );
  } else if (!userTokens.loading && orderedUserTokenBalanceList?.length) {
    return (
      <>
        {showEngineTokenSettings && (
          <>
            {isSearchOpen && <Separator height={5} />}
            <View style={[styles.flexRow]}>
              {isSearchOpen && (
                <CustomSearchBar
                  theme={theme}
                  value={searchValue}
                  onChangeText={(text) => setSearchValue(text)}
                  additionalContainerStyle={[
                    styles.searchContainer,
                    isSearchOpen ? styles.borderLight : undefined,
                  ]}
                  rightIcon={
                    <Icon
                      name={Icons.SEARCH}
                      theme={theme}
                      onPress={() => {
                        setSearchValue('');
                        setIsSearchOpen(false);
                      }}
                    />
                  }
                />
              )}
              <HiveEngineLogo height={23} width={23} />
              <View style={styles.separatorContainer} />
              <Icon
                name={Icons.SEARCH}
                theme={theme}
                additionalContainerStyle={styles.search}
                onPress={() => setIsSearchOpen(!isSearchOpen)}
                width={18}
                height={18}
              />
              <Icon
                name={Icons.SETTINGS_2}
                theme={theme}
                onPress={handleClickSettings}
              />
            </View>
            {isSearchOpen && <Separator height={5} />}
            <Separator />
          </>
        )}
        <ScrollView
          horizontal={true}
          contentContainerStyle={{width: '100%', height: '100%'}}>
          <FlatList
            // onScroll={handleOnScroll}
            ref={flatListRef}
            data={filteredUserTokenBalanceList}
            contentContainerStyle={styles.flatlist}
            keyExtractor={(item) => item._id.toString()}
            ItemSeparatorComponent={() => <Separator height={10} />}
            renderItem={renderEngineTokenDisplay}
            ListEmptyComponent={
              <View style={{justifyContent: 'center', flex: 1}}>
                <Separator height={15} />
                <Text style={styles.no_tokens}>
                  {translate('wallet.no_tokens')}
                </Text>
              </View>
            }
          />
        </ScrollView>
      </>
    );
  } else return null;
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    flatlist: {
      paddingBottom: 20,
    },
    no_tokens: {
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      ...button_link_primary_medium,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      justifyContent: 'space-between',
    },
    search: {
      marginRight: 4,
    },
    searchContainer: {
      position: 'absolute',
      right: 0,
      zIndex: 10,
      height: 45,
    },
    separatorContainer: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      height: 1,
      backgroundColor: getColors(theme).separatorBgColor,
      width: '75%',
      flexShrink: 1,
    },
    borderLight: {
      borderColor: getColors(theme).cardBorderColor,
      borderWidth: 1,
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
