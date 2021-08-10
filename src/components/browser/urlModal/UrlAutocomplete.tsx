import {Page} from 'actions/interfaces';
import Fuse from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import HistoryItem from './HistoryItem';

type Props = {
  onSubmit: (string: string) => void;
  history: Page[];
  input: string;
};
export default ({input, onSubmit, history}: Props) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fuse = new Fuse(history, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      //maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        {name: 'name', weight: 0.5},
        {name: 'url', weight: 0.5},
      ],
    });
    const fuseSearchResult = fuse.search(input);
    if (Array.isArray(fuseSearchResult)) {
      setCandidates(fuseSearchResult.map((e) => e.item));
    } else {
      setCandidates([]);
    }
  }, [input, history]);

  return (
    <View style={styles.wrapper}>
      {candidates.map((e) => (
        <HistoryItem onSubmit={onSubmit} data={e} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 20},
});
