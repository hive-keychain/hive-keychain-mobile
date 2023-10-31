import {loadAccount} from 'actions/hive';
import {removePreference} from 'actions/preferences';
import CustomSearchBar from 'components/form/CustomSearchBar';
import PickerItem, {PickerItemInterface} from 'components/form/PickerItem';
import Icon from 'components/hive/Icon';
import CollapsibleSettings from 'components/settings/CollapsibleSettings';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {DomainPreference} from 'reducers/preferences.types';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_2, body_primary_body_3} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

const Operations = ({
  preferences,
  active,
  removePreference,
  accounts,
  loadAccount,
}: PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [domainList, setDomainList] = useState<DomainPreference[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<DomainPreference[]>(
    [],
  );
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
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
  };

  useEffect(() => {
    const newArray = [...domainList];
    setFilteredDomains(
      newArray.filter((domain) =>
        domain.domain.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    );
  }, [searchValue, domainList]);

  const getItemDropDownSelected = (username: string): PickerItemInterface => {
    const selected = accounts.filter((acc) => acc.name === username)[0];
    return {
      label: selected.name,
      value: selected.name,
      icon: <UserProfilePicture username={username} style={styles.avatar} />,
    };
  };

  return (
    <Background using_new_ui theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.marginVertical,
            {...body_primary_body_3},
            styles.paddingHorizontal,
          ]}>
          {capitalizeSentence(translate('settings.settings.operations_info'))}
        </Text>
        <PickerItem
          theme={theme}
          selected={getItemDropDownSelected(active.name!)}
          additionalContainerStyle={getCardStyle(theme).defaultCardItem}
          pickerItemList={accounts.map((acc) => {
            return {
              label: acc.name,
              value: acc.name,
              icon: (
                <UserProfilePicture username={acc.name} style={styles.avatar} />
              ),
            };
          })}
          onSelectedItem={(item) => {
            loadAccount(item.value, true);
          }}
        />
        <CustomSearchBar
          theme={theme}
          additionalContainerStyle={[
            getCardStyle(theme).defaultCardItem,
            styles.searchBar,
          ]}
          rightIcon={<Icon name="search" theme={theme} />}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
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
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    avatar: {width: 30, height: 30, borderRadius: 50},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: 15,
    },
    textNoPref: {
      textAlign: 'center',
      marginTop: 20,
    },
    searchBar: {
      borderRadius: 33,
      marginVertical: 10,
      width: '100%',
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