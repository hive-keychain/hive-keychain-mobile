import {TabFields} from 'actions/interfaces';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  data: TabFields;
  onSubmit: (url: string) => void;
};
export default ({data, onSubmit}: Props) => {
  const {name, url, icon} = data;
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

const styles = StyleSheet.create({
  itemWrapper: {flexDirection: 'row', marginHorizontal: 20, marginVertical: 5},
  text: {marginLeft: 10},
  name: {fontWeight: 'bold'},
  img: {width: 20, height: 20},
});
