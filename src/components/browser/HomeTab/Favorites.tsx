import {Page} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DraggableFlatList, {
  DragEndParams,
} from 'react-native-draggable-flatlist';
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
  const styles = getStyles(theme);

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
              onSubmit={(e) => {
                updateTabUrl(e);
              }}
              theme={theme}
              drag={drag}
              isActive={isActive}
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
      paddingBottom: 160,
    },
    text: {
      alignSelf: 'center',
      marginTop: 20,
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
  });
