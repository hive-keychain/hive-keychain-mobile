import {setToggleElement} from 'hooks/toggle';
import React, {useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {translate} from 'utils/localize';

type Props = {
  components: JSX.Element[];
  menu: string[];
  toUpperCase: boolean;
  style?: StyleProp<ViewStyle>;
};
const ScreenToggle = ({components, menu, toUpperCase, style}: Props) => {
  const [active, setActive] = useState(0);
  const styles = getStyles(menu.length);
  return (
    <View style={[styles.wrapper]}>
      <View style={[style, styles.header]}>
        {menu.map((menuItem, i) => (
          <View
            key={menuItem}
            style={
              i === active
                ? [styles.headerElt, styles.headerActiveElt]
                : styles.headerElt
            }>
            <Text
              style={styles.headerText}
              onPress={() => {
                setActive(i);
                setToggleElement(menuItem);
              }}>
              {toUpperCase
                ? translate(`wallet.menu.${menuItem}`).toUpperCase()
                : translate(`wallet.menu.${menuItem}`)}
            </Text>
          </View>
        ))}
      </View>
      <View style={[style, styles.pane]}>{components[active]}</View>
    </View>
  );
};

const getStyles = (nb: number) =>
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
      justifyContent: 'center',
    },
    headerElt: {
      width: `${Math.round(90 / nb)}%`,
    },
    headerText: {textAlign: 'center', fontSize: 16, paddingBottom: 10},
    headerActiveElt: {
      borderColor: '#E31337',
      borderBottomWidth: 3,
    },
    pane: {
      width: '100%',
      backgroundColor: '#E5EEF7',
      flex: 1,
    },
  });

export default ScreenToggle;
