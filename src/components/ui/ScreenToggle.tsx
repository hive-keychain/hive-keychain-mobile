import {setToggleElement} from 'hooks/toggle';
import React, {useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';

type Props = {
  components: JSX.Element[];
  menu: string[];
  toUpperCase: boolean;
  style?: StyleProp<ViewStyle>;
  additionalHeaderStyle?: StyleProp<ViewStyle>;
  theme: Theme;
};
const ScreenToggle = ({
  components,
  menu,
  toUpperCase,
  style,
  additionalHeaderStyle,
  theme,
}: Props) => {
  const [active, setActive] = useState(0);
  const styles = getStyles(menu.length, theme);
  return (
    <View style={[styles.wrapper]}>
      <View style={[style, styles.header, additionalHeaderStyle]}>
        {menu.map((menuItem, i) => (
          <View
            key={menuItem}
            style={[
              styles.headerItemBase,
              i === active
                ? [styles.headerElt, styles.headerActiveElt]
                : styles.headerElt,
            ]}>
            <Text
              style={[
                styles.headerText,
                i === active ? styles.headerActiveText : styles.opaqueText,
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

const getStyles = (nb: number, theme: Theme) =>
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
      marginTop: 20,
      justifyContent: 'space-between',
    },
    headerElt: {
      width: `${Math.round(90 / nb)}%`,
    },
    headerText: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      textAlign: 'center',
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
