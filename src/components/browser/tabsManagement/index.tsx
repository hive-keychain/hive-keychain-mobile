import {Tab} from 'actions/interfaces';
import {Caption} from 'components/ui/Caption';
import React, {MutableRefObject} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {BORDERWHITISH, DARKBLUELIGHTER, getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import TabsManagementBottomBar from './BottomBar';

//TODO: put in config
const margin = Dimensions.get('window').width * 0.02;
const THUMB_WIDTH = Dimensions.get('window').width * 0.46;
const THUMB_HEIGHT = THUMB_WIDTH * 1.3;

type Props = {
  tabs: Tab[];
  onSelectTab: (id: number) => void;
  onCloseTab: (id: number) => void;
  onCloseAllTabs: () => void;
  onQuitManagement: () => void;
  onAddTab: (
    isManagingTab: boolean,
    tab: Tab,
    webview: MutableRefObject<View>,
  ) => void;
  activeTab: number;
  show: boolean;
  theme: Theme;
};
export default ({
  tabs,
  onSelectTab,
  onCloseTab,
  onCloseAllTabs,
  onAddTab,
  onQuitManagement,
  activeTab,
  show,
  theme,
}: Props) => {
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, show ? null : styles.hide]}>
      <ScrollView>
        <Caption text="browser.switch_tabs_tip" hideSeparator />
        <View style={styles.subcontainer}>
          {tabs.map(({icon, image, name, id}) => (
            <TouchableOpacity
              activeOpacity={1}
              key={id}
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.tabWrapper,
                id === activeTab ? styles.activeTab : null,
              ]}
              onPress={() => {
                onSelectTab(id);
              }}>
              <View style={styles.titleContainer}>
                <View style={styles.nameContainer}>
                  <Image style={[styles.icon]} source={{uri: icon}} />
                  <Text
                    style={[
                      styles.textBase,
                      styles.name,
                      styles.contrastColor,
                      {marginBottom: -4},
                    ]}>
                    {name}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.closeIconContainer}
                  onPress={() => {
                    onCloseTab(id);
                  }}>
                  <Icon
                    name="close"
                    style={[styles.closeIcon, styles.contrastColor]}
                  />
                </TouchableOpacity>
              </View>
              <Image style={styles.screenshot} source={{uri: image}} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TabsManagementBottomBar
        onCloseAllTabs={onCloseAllTabs}
        onAddTab={() => {
          onAddTab(true, null, null);
        }}
        onQuitManagement={onQuitManagement}
        showSideButtons={!!activeTab}
        theme={theme}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    tip: {
      fontSize: 14,
      marginTop: 15,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    container: {
      flex: 1,
      backgroundColor: getColors(theme).primaryBackground,
    },
    subcontainer: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
    hide: {display: 'none'},
    tabWrapper: {
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      margin,
      overflow: 'hidden',
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    contrastColor: {
      color: theme === Theme.LIGHT ? BORDERWHITISH : DARKBLUELIGHTER,
    },
    titleContainer: {
      height: 40,
      backgroundColor: theme === Theme.LIGHT ? DARKBLUELIGHTER : BORDERWHITISH,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      justifyContent: 'space-between',
    },
    activeTab: {
      borderColor: '#A3112A',
    },
    nameContainer: {
      flexDirection: 'row',
      maxWidth: '80%',
      alignItems: 'center',
    },
    screenshot: {
      flex: 1,
      resizeMode: 'cover',
    },
    icon: {width: 16, height: 16},
    name: {
      fontSize: 16,
      textAlignVertical: 'bottom',
      flex: 1,
      marginHorizontal: 10,
    },
    closeIcon: {fontSize: 20},
    close: {color: 'white', fontWeight: 'bold', fontSize: 18},
    closeView: {
      minWidth: 30,
      height: '100%',
      padding: 0,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    closeIconContainer: {
      padding: 4,
    },
  });
