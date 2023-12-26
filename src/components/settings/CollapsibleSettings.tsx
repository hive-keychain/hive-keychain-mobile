import {ActionPayload} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DomainPreference, PreferencePayload} from 'reducers/preferences.types';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import {wordsFromCamelCase} from 'utils/format';
import {translate} from 'utils/localize';

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

  return (
    <View style={getCardStyle(theme).defaultCardItem}>
      <Text style={[styles.domain, styles.font]}>
        {translate('common.dapp_title')}: {domainPref.domain}
      </Text>
      <View style={styles.whitelistsContainer}>
        {domainPref.whitelisted_requests.map((e) => (
          <View style={styles.whitelistContainer} key={e}>
            <Text style={[styles.whitelist, styles.font, styles.opacity]}>
              {wordsFromCamelCase(e)}
            </Text>
            <Icon
              name={Icons.REMOVE}
              theme={theme}
              onClick={() => {
                removePreference(username, domainPref.domain, e);
              }}
              {...styles.removeIcon}
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
