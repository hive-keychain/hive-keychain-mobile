import {loadAccount} from 'actions/hive';
import {removePreference} from 'actions/preferences';
import CustomSearchBar from 'components/form/CustomSearchBar';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import CollapsibleSettings from 'components/settings/CollapsibleSettings';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
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
import {DomainPreference} from 'reducers/preferences.types';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  body_primary_body_3,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

const Operations = ({
  preferences,
  active,
  removePreference,
}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
  const [domainList, setDomainList] = useState<DomainPreference[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<DomainPreference[]>(
    [],
  );
  const [searchValue, setSearchValue] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    init();
  }, [active]);

  const init = () => {
    const userPreference = preferences.find((e) => e.username === active.name);
    setDomainList(
      userPreference &&
        userPreference.domains &&
        userPreference.domains.length > 0
        ? preferences.find((e) => e.username === active.name)?.domains || []
        : [],
    );
    setTimeout(() => {
      setLoadingData(false);
    }, 1000);
  };

  useEffect(() => {
    const newArray = [...domainList];
    setFilteredDomains(
      newArray.filter((domain) =>
        domain.domain.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  }, [searchValue, domainList]);

  const renderCollapsibleSettings = useCallback(
    ({item, index}) => (
      <CollapsibleSettings
        username={active.name}
        key={item.domain}
        index={index}
        domainPref={item}
        removePreference={removePreference}
        theme={theme}
      />
    ),
    [active.name, removePreference, theme],
  );

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <Caption text="settings.settings.operations_info" hideSeparator />
        <UserDropdown />
        <CustomSearchBar
          theme={theme}
          additionalContainerStyle={[
            getCardStyle(theme).defaultCardItem,
            styles.searchBar,
          ]}
          additionalCustomInputStyle={{height: 45}}
          rightIcon={<Icon name={Icons.SEARCH} theme={theme} />}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        {!loadingData && (
          <FlatList
            data={filteredDomains}
            renderItem={renderCollapsibleSettings}
            ListEmptyComponent={
              <Text style={[styles.text, styles.textNoPref]}>
                {translate('settings.settings.no_pref')}
              </Text>
            }
          />
        )}
        {loadingData && (
          <View style={[styles.flexCentered, styles.marginTop]}>
            <Loader animating size={'small'} />
          </View>
        )}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    marginTop: {marginTop: 20},
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    textOperations: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_3}.fontSize,
      ),
    },
    textNoPref: {
      textAlign: 'center',
      marginTop: 20,
    },
    searchBar: {
      borderRadius: 33,
      marginVertical: 10,
      width: '100%',
      height: 45,
    },
    opacity: {
      opacity: 0.7,
    },
    marginVertical: {
      marginVertical: 15,
    },
    paddingHorizontal: {
      paddingHorizontal: 10,
    },
    flexCentered: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      preferences: state.preferences,
      active: state.activeAccount,
    };
  },
  {removePreference, loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Operations);
