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
const margin = 7;
const THUMB_WIDTH = (Dimensions.get('window').width - margin * 2) * 0.48;
const THUMB_HEIGHT = THUMB_WIDTH * 1.3;

export default ({
  tabs,
  onSelectTab,
  onCloseTab,
  onCloseAllTabs,
  onAddTab,
  onQuitManagement,
  activeTab,
  show,
}) => {
  console.log(activeTab, tabs);
  return (
    <View style={[styles.container, show ? null : styles.hide]}>
      <ScrollView>
        <View style={styles.subcontainer}>
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
        </View>
      </ScrollView>
      <TabsManagementBottomBar
        onCloseAllTabs={onCloseAllTabs}
        onAddTab={onAddTab}
        onQuitManagement={onQuitManagement}
        showSideButtons={!!activeTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'lightgrey'},
  subcontainer: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
  hide: {display: 'none'},
  tabWrapper: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    margin,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'darkgrey',
    borderWidth: 3,
  },
  titleContainer: {
    height: 40,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  activeTab: {
    borderColor: '#A3112A',
  },
  nameContainer: {flexDirection: 'row', maxWidth: '80%', alignItems: 'center'},
  screenshot: {
    flex: 1,
    resizeMode: 'cover',
  },
  icon: {width: 16, height: 16},
  name: {fontSize: 16, color: 'white', marginLeft: 10},
  close: {color: 'white', fontWeight: 'bold', fontSize: 18},
});
