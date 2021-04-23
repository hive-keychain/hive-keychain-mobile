import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

//TODO: put in config
const margin = 20;
const THUMB_WIDTH = Dimensions.get('window').width - margin * 2;
const THUMB_HEIGHT = THUMB_WIDTH * 0.4;

export default ({tabs, onSelectTab}) => {
  console.log(tabs);
  return (
    <ScrollView style={styles.container}>
      {tabs.map(({icon, image, name, id}) => (
        <TouchableOpacity
          style={styles.tabWrapper}
          onPress={() => {
            onSelectTab(id);
          }}>
          <View style={styles.titleContainer}>
            <View style={styles.nameContainer}>
              <Image style={styles.icon} source={{uri: icon}} />
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
            </View>
            <Text style={styles.close}>X</Text>
          </View>
          <Image style={styles.screenshot} source={{uri: image}} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  tabWrapper: {
    flex: 0,
    margin,
  },
  titleContainer: {
    width: THUMB_WIDTH,
    height: 40,
    backgroundColor: 'black',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  nameContainer: {flexDirection: 'row'},
  screenshot: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  icon: {width: 20, height: 20},
  name: {fontSize: 18, color: 'white', marginLeft: 20},
  close: {color: 'white', fontWeight: 'bold', fontSize: 18},
});
