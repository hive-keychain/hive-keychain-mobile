import {Page} from 'actions/interfaces';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  FontPoppinsName,
  title_primary_body_3,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import HistoryItem from '../urlModal/HistoryItem';

type Props = {
  history: Page[];
  updateTabUrl: (link: string) => void;
  clearHistory: () => void;
  theme: Theme;
};

export default ({history, updateTabUrl, clearHistory, theme}: Props) => {
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      {history.length ? (
        <>
          <TouchableOpacity activeOpacity={1} onPress={clearHistory}>
            <Text style={[styles.textBase, styles.clearHistory]}>
              {translate('browser.history.clear')}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={[...history].reverse()}
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
        </>
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
      paddingBottom: 160,
    },
    text: {
      alignSelf: 'center',
      marginTop: 20,
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
    clearHistory: {
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_3,
      fontSize: 14,
      fontFamily: FontPoppinsName.REGULAR,
    },
  });
