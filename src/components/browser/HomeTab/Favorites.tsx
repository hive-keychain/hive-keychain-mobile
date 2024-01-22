import {Page} from 'actions/interfaces';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {translate} from 'utils/localize';
import HistoryItem from '../urlModal/HistoryItem';

type Props = {
  favorites: Page[];
  updateTabUrl: (link: string) => void;
  theme: Theme;
};

export default ({favorites, updateTabUrl, theme}: Props) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      {favorites.length ? (
        <FlatList
          data={[...favorites].reverse()}
          keyExtractor={(item) => item.url}
          renderItem={({item}) => (
            <HistoryItem
              data={item}
              key={item.url}
              onSubmit={(e) => {
                updateTabUrl(e);
              }}
              theme={theme}
            />
          )}
        />
      ) : (
        <Text style={styles.text}>{translate('browser.home.nothing')}</Text>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginTop: 10,
      flex: 1,
      paddingHorizontal: 20,
    },
    text: {
      alignSelf: 'center',
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
  });
