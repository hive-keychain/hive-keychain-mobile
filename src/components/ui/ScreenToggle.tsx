import {setToggleElement} from 'hooks/toggle';
import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

type Props = {
  components: JSX.Element[];
  menu: string[];
  toUpperCase: boolean;
  style?: StyleProp<ViewStyle>;
  additionalHeaderStyle?: StyleProp<ViewStyle>;
  theme: Theme;
  addShadowItem?: boolean;
};
const ScreenToggle = ({
  components,
  menu,
  toUpperCase,
  style,
  additionalHeaderStyle,
  theme,
  addShadowItem,
}: Props) => {
  const [active, setActive] = useState(0);
  const styles = getStyles(menu.length, theme, useWindowDimensions());

  return (
    <View style={[styles.wrapper]}>
      <View style={[style, styles.header, additionalHeaderStyle]}>
        {menu.map((menuItem, i) => (
          <View
            key={menuItem}
            style={[
              styles.headerItemBase,
              i === active
                ? [
                    styles.headerElt,
                    styles.headerActiveElt,
                    addShadowItem
                      ? generateBoxShadowStyle(
                          0,
                          13,
                          RED_SHADOW_COLOR,
                          1,
                          25,
                          30,
                          RED_SHADOW_COLOR,
                        )
                      : undefined,
                  ]
                : styles.headerElt,
            ]}>
            <Text
              style={[
                styles.headerText,
                i === active ? styles.headerActiveText : styles.opaqueText,
                menu.length >= 4 ? styles.smallerHeaderText : undefined,
              ]}
              onPress={() => {
                setActive(i);
                setToggleElement(menuItem);
              }}>
              {toUpperCase ? menuItem.toUpperCase() : menuItem}
            </Text>
          </View>
        ))}
      </View>
      <View style={[style, styles.pane]}>{components[active]}</View>
    </View>
  );
};

const getStyles = (nb: number, theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    header: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      marginTop: 15,
      justifyContent: 'space-between',
    },
    headerElt: {
      minWidth: `${Math.round(90 / nb)}%`,
    },
    headerText: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    smallerHeaderText: {
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 11),
    },
    headerActiveText: {
      color: 'white',
    },
    opaqueText: {
      opacity: 0.7,
    },
    headerActiveElt: {
      backgroundColor: PRIMARY_RED_COLOR,
      borderRadius: 26,
      alignItems: 'center',
    },
    pane: {
      width: '100%',
      flex: 1,
    },
    headerItemBase: {
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
  });

export default ScreenToggle;
