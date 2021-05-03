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
import TabsManagementBottomBar from './BottomBar';

//TODO: put in config
const margin = 20;
const THUMB_WIDTH = Dimensions.get('window').width - margin * 2;
const THUMB_HEIGHT = THUMB_WIDTH * 0.3;

export default ({tabs, onSelectTab, onCloseTab, onCloseAllTabs, activeTab}) => {
  console.log(tabs);
  console.log('displaying mgt');
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {tabs.map(({icon, image, name, id}) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.tabWrapper,
              id === activeTab ? styles.activeTab : null,
            ]}
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
              <TouchableOpacity
                onPress={() => {
                  onCloseTab(id);
                }}>
                <Text style={styles.close}>X</Text>
              </TouchableOpacity>
            </View>
            <Image style={styles.screenshot} source={{uri: image}} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TabsManagementBottomBar onCloseAllTabs={onCloseAllTabs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'lightgrey'},
  tabWrapper: {
    flex: 0,
    margin,
    backgroundColor: 'black',
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
  activeTab: {
    borderColor: '#A3112A',
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 16,
  },
  nameContainer: {flexDirection: 'row', maxWidth: '70%'},
  screenshot: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    resizeMode: 'cover',
  },
  icon: {width: 20, height: 20},
  name: {fontSize: 18, color: 'white', marginLeft: 20},
  close: {color: 'white', fontWeight: 'bold', fontSize: 18},
});
