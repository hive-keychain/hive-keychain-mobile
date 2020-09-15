import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const ScreenToggle = ({components, menu, toUpperCase, style}) => {
  const [active, setActive] = useState(0);

  return (
    <View style={[style, styles.wrapper]}>
      <View style={styles.header}>
        {menu.map((menuItem, i) => (
          <Text
            onPress={() => {
              setActive(i);
            }}
            style={
              i === active
                ? [styles.headerElt, styles.headerActiveElt]
                : styles.headerElt
            }
            key={menuItem}>
            {toUpperCase ? menuItem.toUpperCase() : menuItem}
          </Text>
        ))}
      </View>
      <View style={styles.pane}>{components[active]}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {display: 'flex', flexDirection: 'column'},
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 20,
  },
  headerElt: {
    width: '50%',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 10,
  },
  headerActiveElt: {borderColor: '#E31337', borderBottomWidth: 3},
  pane: {
    width: '100%',
    height: '100%',
  },
});

export default ScreenToggle;
