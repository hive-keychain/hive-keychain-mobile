import {History, TabFields} from 'actions/interfaces';
import Fuse from 'fuse.js';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  onSubmit: (string: string) => void;
  history: History[];
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

  const renderItem = ({name, url, icon}: TabFields) => {
    return (
      <TouchableOpacity onPress={() => onSubmit(url)} key={url}>
        <View style={styles.itemWrapper}>
          <Image style={styles.img} source={{uri: icon}} />
          <View style={styles.text}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text numberOfLines={1}>{url}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.wrapper}>{candidates.map((e) => renderItem(e))}</View>
  );
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 20},
  itemWrapper: {flexDirection: 'row', marginHorizontal: 20, marginVertical: 5},
  text: {marginLeft: 10},
  name: {fontWeight: 'bold'},
  img: {width: 20, height: 20},
});
