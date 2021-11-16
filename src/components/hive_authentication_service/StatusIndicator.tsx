import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {status: boolean};

export default ({status}: Props) => {
  const styles = getStyles(status);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {}}
      onLongPress={() => {}}>
      <Text style={styles.text}>HAS</Text>
      <View style={styles.indicator}></View>
    </TouchableOpacity>
  );
};

const getStyles = (status: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 25,
      height: 25,
    },
    text: {color: 'white', fontSize: 10},
    indicator: {
      backgroundColor: status ? 'green' : 'darkgrey',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
