import {Page} from 'actions/interfaces';
import Separator from 'components/ui/Separator';
import React, {useCallback} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
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
  removeFromHistory: (url: string) => void;
};

export default ({
  history,
  updateTabUrl,
  clearHistory,
  theme,
  removeFromHistory,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const renderHistoryItem = useCallback(
    ({item, index}: {item: Page; index: number}) => (
      <HistoryItem
        data={item}
        key={item.url}
        indexItem={index}
        onDismiss={() => {
          removeFromHistory(item.url);
        }}
        onSubmit={(e) => {
          updateTabUrl(e);
        }}
        theme={theme}
      />
    ),
    [removeFromHistory, updateTabUrl, theme],
  );
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
            keyExtractor={(item, index) => `${item.url}-${index}`}
            windowSize={15}
            removeClippedSubviews={Platform.OS === 'android'}
            renderItem={renderHistoryItem}
            ListFooterComponent={() => <Separator height={10} />}
          />
        </>
      ) : (
        <Text style={styles.text}>{translate('browser.home.nothing')}</Text>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
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
