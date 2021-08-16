import {Page} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {translate} from 'utils/localize';
import HistoryItem from '../urlModal/HistoryItem';

type Props = {
  history: Page[];
  updateTabUrl: (link: string) => void;
};

export default ({history, updateTabUrl}: Props) => {
  return (
    <View style={styles.container}>
      {history.length ? (
        [...history].reverse().map((h) => (
          <HistoryItem
            data={h}
            key={h.url}
            onSubmit={(e) => {
              updateTabUrl(e);
            }}
          />
        ))
      ) : (
        <Text style={styles.text}>{translate('browser.home.nothing')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 30,
    flex: 1,
  },
  text: {alignSelf: 'center'},
});
