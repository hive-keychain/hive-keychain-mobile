import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import Fuse from 'fuse.js';

export default ({onDismiss, input, onSubmit, history}) => {
  const renderItem = ({name, url, icon}) => {
    return (
      <TouchableOpacity
        containerStyle={styles.item}
        onPress={() => onSubmit(url)}
        key={url}>
        <View style={styles.itemWrapper}>
          <Image style={styles.img} source={{uri: icon}} />
          <View style={styles.text}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.url} numberOfLines={1}>
              {url}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return history.map((e) => renderItem(e));
};

const styles = StyleSheet.create({
  itemWrapper: {flexDirection: 'row', marginHorizontal: 20, marginVertical: 5},
  text: {marginLeft: 10},
  name: {fontWeight: 'bold'},
  img: {width: 20, height: 20},
});
