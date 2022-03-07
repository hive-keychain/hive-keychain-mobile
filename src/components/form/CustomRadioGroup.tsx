import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

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
  data?: string;
  onSelect: (arg0: string) => void;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
};

export const RadioButton = ({data, onSelect, selected, style}: RadioProps) => (
  <TouchableOpacity
    style={styles.radioButton}
    onPress={() => {
      onSelect(data);
    }}>
    <View
      style={[styles.button, selected ? styles.buttonActive : null, style]}
    />
    <View style={styles.labelView}>
      <Text style={styles.label}>{data}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    flexDirection: 'row',
    width: 150,
  },
  button: {
    borderColor: '#77B9D1',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: 20,
  },
  buttonActive: {backgroundColor: '#77B9D1'},
  label: {marginLeft: 10, marginRight: 10},
  labelView: {
    flexDirection: 'column',
    width: '95%',
  },
});
