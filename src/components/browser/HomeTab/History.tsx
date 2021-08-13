import {Page} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {translate} from 'utils/localize';
import HistoryItem from '../urlModal/HistoryItem';

type Props = {
  history: Page[];
};

export default ({history}: Props) => {
  return (
    <View style={styles.container}>
      {history.length ? (
        history.map((h) => (
          <HistoryItem
            data={h}
            onSubmit={(e) => {
              console.log(e);
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