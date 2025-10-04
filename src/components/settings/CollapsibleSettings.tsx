import {ActionPayload} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DomainPreference, PreferencePayload} from 'reducers/preferences.types';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import {capitalize, wordsFromCamelCase} from 'utils/format.utils';

type Props = {
  domainPref: DomainPreference;
  index: number;
  username: string;
  removePreference: (
    username: string,
    domain: string,
    request: string,
  ) => ActionPayload<PreferencePayload>;
  theme: Theme;
};

const CollapsibleSettings = ({
  domainPref,
  index,
  removePreference,
  username,
  theme,
}: Props) => {
  const styles = getStyles(index, theme);
  if (!domainPref.whitelisted_requests.length) return null;
  else
    return (
      <View style={getCardStyle(theme).defaultCardItem}>
        <Text style={[styles.domain, styles.font]}>{domainPref.domain}</Text>
        <View style={styles.whitelistsContainer}>
          {domainPref.whitelisted_requests.map((e) => (
            <View style={styles.whitelistContainer} key={e}>
              <Text style={[styles.whitelist, styles.font, styles.opacity]}>
                {capitalize(wordsFromCamelCase(e))}
              </Text>
              <Icon
                name={Icons.REMOVE}
                theme={theme}
                onPress={() => {
                  removePreference(username, domainPref.domain, e);
                }}
                {...styles.removeIcon}
                color={PRIMARY_RED_COLOR}
              />
            </View>
          ))}
        </View>
      </View>
    );
};

const getStyles = (index: number, theme: Theme) =>
  StyleSheet.create({
    opacity: {
      opacity: 0.7,
    },
    font: {
      ...title_primary_body_2,
    },
    domain: {color: getColors(theme).secondaryText},
    whitelist: {color: getColors(theme).secondaryText},
    whitelistsContainer: {flexDirection: 'column'},
    whitelistContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
      alignItems: 'center',
    },
    removeIcon: {
      width: 15,
      height: 15,
    },
  });

export default CollapsibleSettings;
