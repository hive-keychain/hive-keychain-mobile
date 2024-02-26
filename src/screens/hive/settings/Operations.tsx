import {loadAccount} from 'actions/hive';
import {removePreference} from 'actions/preferences';
import {DropdownItem} from 'components/form/CustomDropdown';
import CustomSearchBar from 'components/form/CustomSearchBar';
import DropdownModal from 'components/form/DropdownModal';
import Icon from 'components/hive/Icon';
import CollapsibleSettings from 'components/settings/CollapsibleSettings';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {DomainPreference} from 'reducers/preferences.types';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {MARGINPADDING} from 'src/styles/spacing';
import {
  SMALLEST_SCREEN_HEIGHT_SUPPORTED,
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
  accounts,
  loadAccount,
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
        ? preferences.find((e) => e.username === active.name).domains
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

  const getItemDropDownSelected = (username: string): DropdownItem => {
    const selected = accounts.filter((acc) => acc.name === username)[0];
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  const getListFromAccount = () =>
    accounts.map((acc) => {
      return {
        label: acc.name,
        value: acc.name,
        icon: <UserProfilePicture username={acc.name} style={styles.avatar} />,
      } as DropdownItem;
    });

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.marginVertical,
            styles.textOperations,
            styles.paddingHorizontal,
            {textAlign: 'center'},
          ]}>
          {translate('settings.settings.operations_info')}
        </Text>
        <DropdownModal
          list={getListFromAccount()}
          selected={getItemDropDownSelected(active.name!)}
          onSelected={(selectedAccount) =>
            loadAccount(selectedAccount.value, true)
          }
          additionalDropdowContainerStyle={styles.dropdownContainer}
          additionalOverlayStyle={styles.dropdownOverlay}
          dropdownIconScaledSize={{width: 15, height: 15}}
        />
        <CustomSearchBar
          theme={theme}
          additionalContainerStyle={[
            getCardStyle(theme).defaultCardItem,
            styles.searchBar,
          ]}
          rightIcon={<Icon name={Icons.SEARCH} theme={theme} />}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        {!loadingData && (
          <FlatList
            data={filteredDomains}
            renderItem={(preference) => {
              return (
                <CollapsibleSettings
                  username={active.name}
                  key={preference.item.domain}
                  index={preference.index}
                  domainPref={preference.item}
                  removePreference={removePreference}
                  theme={theme}
                />
              );
            }}
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
    avatar: {width: 30, height: 30, borderRadius: 50},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    marginTop: {marginTop: 20},
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, 15),
    },
    textOperations: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(
        height,
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
      height: height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? 45 : 50,
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
    dropdownContainer: {
      width: '100%',
      padding: 0,
      borderRadius: 30,
    },
    dropdownOverlay: {
      paddingHorizontal: MARGINPADDING,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      preferences: state.preferences,
      active: state.activeAccount,
      accounts: state.accounts,
    };
  },
  {removePreference, loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Operations);
