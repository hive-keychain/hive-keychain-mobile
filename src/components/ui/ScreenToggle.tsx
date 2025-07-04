import {setToggleElement} from 'hooks/toggle';
import React, {useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
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
  onIndexChanged?: (i: number) => void;
};
const ScreenToggle = ({
  components,
  menu,
  toUpperCase,
  style,
  additionalHeaderStyle,
  theme,
  addShadowItem,
  onIndexChanged,
}: Props) => {
  const [active, setActive] = useState(0);
  const styles = getStyles(menu.length, theme, useWindowDimensions());

  return (
    <View style={[styles.wrapper]}>
      <View style={[style, styles.header, additionalHeaderStyle]}>
        {menu.map((menuItem, i) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setActive(i);
              if (onIndexChanged) onIndexChanged(i);
              setToggleElement(menuItem);
            }}
            key={menuItem}
            style={[styles.headerElt, i === active && styles.headerActiveElt]}>
            <Text
              style={[
                styles.headerText,
                i === active ? styles.headerActiveText : styles.opaqueText,
                menu.length >= 4 ? styles.smallerHeaderText : undefined,
              ]}>
              {toUpperCase ? menuItem.toUpperCase() : menuItem}
            </Text>
          </TouchableOpacity>
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
      paddingVertical: 8,
      minWidth: `${Math.round(90 / nb) - 1}%`,
    },
    headerText: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      textAlignVertical: 'center',
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
      marginHorizontal: 1,
    },
    pane: {
      width: '100%',
      flex: 1,
    },
  });

export default ScreenToggle;
