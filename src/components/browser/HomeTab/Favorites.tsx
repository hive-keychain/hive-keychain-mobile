import {Page} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DraggableFlatList, {
  DragEndParams,
} from 'react-native-draggable-flatlist';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {translate} from 'utils/localize';
import HistoryItem from '../urlModal/HistoryItem';
type Props = {
  favorites: Page[];
  updateTabUrl: (link: string) => void;
  updateFavorites: (favorites: Page[]) => void;
  theme: Theme;
};

export default ({favorites, updateTabUrl, updateFavorites, theme}: Props) => {
  const styles = getStyles(useSafeAreaInsets(), theme);

  const sortData = (params: DragEndParams<Page>) => {
    updateFavorites([...params.data].reverse());
  };

  return (
    <View style={styles.container}>
      {favorites.length ? (
        <DraggableFlatList
          data={[...favorites].reverse()}
          scrollToOverflowEnabled
          keyExtractor={(item) => item.url}
          onDragEnd={sortData}
          renderItem={({item, drag, isActive}) => (
            <HistoryItem
              data={item}
              key={item.url}
              onDismiss={() =>
                updateFavorites(favorites.filter((e) => e.url !== item.url))
              }
              onSubmit={(e) => {
                updateTabUrl(e);
              }}
              theme={theme}
              drag={drag}
            />
          )}
        />
      ) : (
        <Text style={styles.text}>{translate('browser.home.nothing')}</Text>
      )}
    </View>
  );
};

const getStyles = (insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginTop: 10,
      flex: 1,
      paddingBottom: 140 + insets.bottom / 2,
    },
    text: {
      alignSelf: 'center',
      marginTop: 20,
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
  });
