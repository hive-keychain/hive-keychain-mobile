import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const ScreenToggle = ({components, menu, toUpperCase, style}) => {
  const [active, setActive] = useState(0);

  return (
    <View style={[styles.wrapper]}>
      <View style={[style, styles.header]}>
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
      <View style={[style, styles.pane]}>{components[active]}</View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#E5EEF7',
    flex: 1,
  },
});

export default ScreenToggle;
