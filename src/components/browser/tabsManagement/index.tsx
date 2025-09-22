import Icon from '@expo/vector-icons/MaterialIcons';
import {Tab} from 'actions/interfaces';
import {Caption} from 'components/ui/Caption';
import FastImageComponent from 'components/ui/FastImage';
import {Image} from 'expo-image';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {BORDERWHITISH, DARKBLUELIGHTER, getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';

// Maintain the previous visual ratio: height ≈ width * 1.3
const CARD_ASPECT_RATIO = 1 / 1.3; // width / height
const SIDE_MARGIN = Dimensions.get('window').width * 0.025;

type Props = {
  tabs: Tab[];
  onSelectTab: (id: number) => void;
  onCloseTab: (id: number) => void;
  activeTab: number;
  show: boolean;
  theme: Theme;
};
export default ({
  tabs,
  onSelectTab,
  onCloseTab,
  activeTab,
  show,
  theme,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);

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
                  <FastImageComponent style={[styles.icon]} source={icon} />
                  <Text
                    numberOfLines={1}
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
              <Image
                style={styles.screenshot}
                source={{uri: image}}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets) =>
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
      paddingBottom: insets.bottom,
    },
    subcontainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: SIDE_MARGIN,
    },
    hide: {display: 'none'},
    tabWrapper: {
      // Two per row using percentage-based sizing
      flexBasis: '46%',
      maxWidth: '46%',
      aspectRatio: CARD_ASPECT_RATIO,
      marginBottom: 16,
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
      borderWidth: 2,
    },
    nameContainer: {
      flexDirection: 'row',
      maxWidth: '80%',
      alignItems: 'center',
    },
    screenshot: {
      flex: 1,
    },
    icon: {width: 16, height: 16},
    name: {
      fontSize: 14,
      textAlignVertical: 'bottom',
      overflow: 'hidden',
      flex: 1,
      marginLeft: 10,
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
