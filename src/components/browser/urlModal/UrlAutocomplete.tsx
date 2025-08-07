import {Page} from 'actions/interfaces';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {RootState, store} from 'store';
import {DApp} from '../HomeTab/Explore';
import HistoryItem from './HistoryItem';

type Props = {
  onSubmit: (string: string) => void;
  history: Page[];
  input: string;
  theme: Theme;
};
const UrlAutocomplete = ({
  input,
  onSubmit,
  history,
  theme,
  ecosystem,
}: Props & PropsFromRedux) => {
  const [candidates, setCandidates] = useState([]);
  const [debouncedInput, setDebouncedInput] = useState(input);

  // Debounce input changes
  const debouncedSetInput = useRef(
    debounce((val) => setDebouncedInput(val), 200),
  ).current;

  useEffect(() => {
    debouncedSetInput(input);
  }, [input, debouncedSetInput]);

  useEffect(() => {
    const flatEcosystem: DApp[] = ecosystem.reduce((a, b): DApp[] => {
      return [
        ...a,
        ...b.dapps.filter((dapp) => !a.find((e) => e.name === dapp.name)),
      ];
    }, []);

    const dApps = [
      ...history,
      ...flatEcosystem
        .map((e) => ({
          url:
            e.url +
            (e.appendUsername ? store.getState().activeAccount.name : ''),
          name: e.name,
          icon: e.icon,
        }))
        .filter((e) => !history.find((f) => f.url === e.url)),
    ];
    const fuse = new Fuse(dApps, {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      isCaseSensitive: false,
      useExtendedSearch: true,
      ignoreLocation: true,
      minMatchCharLength: 0,
      keys: [
        {name: 'name', weight: 0.5},
        {name: 'url', weight: 0.5},
      ],
    });
    const fuseSearchResult = fuse.search(debouncedInput).slice(0, 8);
    if (Array.isArray(fuseSearchResult)) {
      setCandidates(fuseSearchResult.map((e) => e.item));
    } else {
      setCandidates([]);
    }
  }, [debouncedInput, history, ecosystem]);
  const renderCandidateItem = useCallback(
    ({item, index}) => (
      <HistoryItem
        theme={theme}
        onSubmit={onSubmit}
        data={item}
        indexItem={index}
        enabled={false}
      />
    ),
    [theme, onSubmit],
  );
  const renderHistoryItem = useCallback(
    ({item, index}) => (
      <HistoryItem
        theme={theme}
        onSubmit={onSubmit}
        data={item}
        indexItem={index}
        enabled={false}
      />
    ),
    [theme, onSubmit],
  );
  if (candidates.length)
    return (
      <View style={styles.wrapper}>
        <FlatList
          data={candidates}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          windowSize={5}
          scrollEnabled
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
          renderItem={renderCandidateItem}
        />
      </View>
    );
  else {
    let historyCopy = [...history].reverse().slice(0, 8);
    return (
      <View style={styles.wrapper}>
        <FlatList
          data={historyCopy}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          scrollEnabled
          keyboardShouldPersistTaps="handled"
          renderItem={renderHistoryItem}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 20, flex: 1},
});

const connector = connect((state: RootState) => {
  return {
    ecosystem: state.ecosystem,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UrlAutocomplete);
