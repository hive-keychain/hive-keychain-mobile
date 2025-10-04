import {Page} from 'actions/interfaces';
import Separator from 'components/ui/Separator';
import React, {useCallback} from 'react';
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
    // Persist the order without reversing back/forth
    updateFavorites(params.data);
  };

  const renderFavoriteItem = useCallback(
    ({item, drag, getIndex}: {item: Page; drag: any; getIndex: any}) => (
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
    ),
    [favorites, updateFavorites, updateTabUrl, theme],
  );

  return (
    <View style={styles.container}>
      {favorites.length ? (
        <DraggableFlatList
          data={favorites}
          scrollToOverflowEnabled
          keyExtractor={(item) => item.url}
          maxToRenderPerBatch={5}
          onDragEnd={sortData}
          renderItem={renderFavoriteItem}
          ListFooterComponent={() => <Separator height={10} />}
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
        Platform.OS === 'ios' ? insets.bottom / 2 + 70 : insets.bottom + 70,
    },
    text: {
      alignSelf: 'center',
      marginTop: 20,
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
  });
