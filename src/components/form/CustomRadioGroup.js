import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

export default ({list, onSelect, selected}) => (
  <View style={styles.radioGroup}>
    {list.map((data) => (
      <RadioButton
        data={data}
        onSelect={onSelect}
        selected={selected === data}
        key={data}
      />
    ))}
  </View>
);

const RadioButton = ({data, onSelect, selected}) => (
  <TouchableOpacity
    style={styles.radioButton}
    onPress={() => {
      console.log('click', data);
      onSelect(data);
    }}>
    <View style={[styles.button, selected ? styles.buttonActive : null]} />
    <Text style={styles.label}>{data}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioGroup: {flexDirection: 'row', justifyContent: 'flex-end'},
  radioButton: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    borderColor: '#77B9D1',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: 20,
  },
  buttonActive: {backgroundColor: '#77B9D1'},
  label: {marginLeft: 10},
});
