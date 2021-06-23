import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  list: string[];
  onSelect: (arg0: string) => void;
  selected: string;
};

export default ({list, onSelect, selected}: Props) => (
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

type RadioProps = {
  data: string;
  onSelect: (arg0: string) => void;
  selected: boolean;
};

const RadioButton = ({data, onSelect, selected}: RadioProps) => (
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
