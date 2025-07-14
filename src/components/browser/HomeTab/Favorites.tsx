import {Page} from 'actions/interfaces';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
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
          maxToRenderPerBatch={5}
          onDragEnd={sortData}
          renderItem={({item, drag, getIndex}) => (
            <HistoryItem
              data={item}
              key={item.url}
              indexItem={getIndex()}
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
      paddingBottom:
        Platform.OS === 'ios' ? insets.bottom / 2 + 80 : insets.bottom + 80,
    },
    text: {
      alignSelf: 'center',
      marginTop: 20,
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
  });
