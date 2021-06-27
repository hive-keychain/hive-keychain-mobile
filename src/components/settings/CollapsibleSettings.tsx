import {ActionPayload} from 'actions/interfaces';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DomainPreference, PreferencePayload} from 'reducers/preferences.types';

type Props = {
  domainPref: DomainPreference;
  index: number;
  username: string;
  removePreference: (
    username: string,
    domain: string,
    request: string,
  ) => ActionPayload<PreferencePayload>;
};

const CollaspibleSettings = ({
  domainPref,
  index,
  removePreference,
  username,
}: Props) => {
  const [isCollapsed, collapse] = useState(true);
  const styles = getStyles(index);
  const renderCollapsed = () => {
    if (isCollapsed) return false;
    else
      return (
        <View style={styles.whitelistContainer}>
          {domainPref.whitelisted_requests.map((e) => (
            <>
              <Text style={styles.whitelist}>{e.toUpperCase()}</Text>
              <TouchableOpacity
                onPress={() => {
                  removePreference(username, domainPref.domain, e);
                }}>
                <Text style={styles.whitelistClose}>X</Text>
              </TouchableOpacity>
            </>
          ))}
        </View>
      );
  };
  return (
    <>
      <TouchableOpacity
        style={styles.collapsible}
        onPress={() => {
          collapse(!isCollapsed);
        }}>
        <Text style={styles.domain}>{domainPref.domain.toUpperCase()}</Text>
        <Text style={styles.domain}>▼</Text>
      </TouchableOpacity>
      {renderCollapsed()}
    </>
  );
};

const getStyles = (index: number) =>
  StyleSheet.create({
    collapsible: {
      backgroundColor: index % 2 === 0 ? 'lightgrey' : '#E5EEF7',
      marginHorizontal: -20,
      paddingVertical: 10,
      paddingHorizontal: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    domain: {color: 'black'},
    whitelist: {color: 'black', paddingHorizontal: 50, paddingVertical: 5},
    whitelistClose: {
      color: 'black',
      fontWeight: 'bold',
      paddingHorizontal: 50,
      paddingVertical: 5,
    },
    whitelistContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  });

export default CollaspibleSettings;
