import {loadAccount} from 'actions/hive';
import {removePreference} from 'actions/preferences';
import ItemDropdown from 'components/form/ItemDropdown';
import CollapsibleSettings from 'components/settings/CollapsibleSettings';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {RootState} from 'store';
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

  const showPreferencesHandler = () => {
    const userPreference = preferences.find((e) => e.username === active.name);
    if (!userPreference || !userPreference.domains.length)
      return <Text>{translate('settings.settings.no_pref')}</Text>;
    return (
      <FlatList
        data={userPreference.domains}
        renderItem={(preference) => {
          return (
            <CollapsibleSettings
              username={active.name}
              key={preference.item.domain}
              index={preference.index}
              domainPref={preference.item}
              removePreference={removePreference}
            />
          );
        }}
      />
    );
  };

  return (
    <Background using_new_ui theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <ItemDropdown
          theme={theme}
          itemDropdownList={accounts.map((acc) => {
            return {
              label: acc.name,
              value: acc.name,
              icon: (
                <UserProfilePicture username={acc.name} style={styles.avatar} />
              ),
            };
          })}
          additionalContainerStyle={[styles.cardKey, styles.zIndexBase]}
          additionalContainerListStyle={[
            styles.itemListContainer,
            styles.zIndexLower,
          ]}
          onSelectedItem={(item) => {
            loadAccount(item.value, true);
          }}
        />
        {showPreferencesHandler()}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    avatar: {width: 30, height: 30, borderRadius: 50},
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    },
    zIndexBase: {
      zIndex: 10,
    },
    zIndexLower: {
      zIndex: 9,
    },
    itemListContainer: {
      top: 20,
      paddingTop: 50,
      paddingBottom: 30,
      width: '99%',
      left: 18,
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
