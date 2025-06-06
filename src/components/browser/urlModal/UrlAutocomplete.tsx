import {Page} from 'actions/interfaces';
import Fuse from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
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
    const fuseSearchResult = fuse.search(input).slice(0, 8);
    if (Array.isArray(fuseSearchResult)) {
      setCandidates(fuseSearchResult.map((e) => e.item));
    } else {
      setCandidates([]);
    }
  }, [input, history, ecosystem]);
  if (candidates.length)
    return (
      <View style={styles.wrapper}>
        <FlatList
          data={candidates}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <HistoryItem
              theme={theme}
              onSubmit={onSubmit}
              data={item}
              indexItem={index}
              enabled={false}
            />
          )}
          keyExtractor={(item) => item.url}
        />
      </View>
    );
  else {
    let historyCopy = [...history].reverse().slice(0, 8);
    return (
      <View style={styles.wrapper}>
        <FlatList
          data={historyCopy}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}) => (
            <HistoryItem
              theme={theme}
              onSubmit={onSubmit}
              data={item}
              indexItem={index}
              enabled={false}
            />
          )}
          keyExtractor={(item) => item.url}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 20},
});

const connector = connect((state: RootState) => {
  return {
    ecosystem: state.ecosystem,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UrlAutocomplete);
