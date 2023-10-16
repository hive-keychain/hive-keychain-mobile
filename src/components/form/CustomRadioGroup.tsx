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
        label={data}
        onSelect={onSelect}
        selected={selected === data}
        key={data}
        radioStyle={{width: 150}}
      />
    ))}
  </View>
);

type RadioProps = {
  label?: string;
  onSelect: (arg0: string) => void;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
  radioStyle?: StyleProp<ViewStyle>;
  additionalRadioStyleActive?: StyleProp<ViewStyle>;
};

export const RadioButton = ({
  label,
  onSelect,
  selected,
  style,
  radioStyle,
  additionalRadioStyleActive,
}: RadioProps) => (
  <TouchableOpacity
    style={[styles.radioButton, radioStyle]}
    onPress={() => {
      onSelect(label);
    }}>
    <View
      style={[
        styles.button,
        selected ? [styles.buttonActive, additionalRadioStyleActive] : null,
        style,
      ]}
    />
    <View style={styles.labelView}>
      <Text style={styles.label}>{label}</Text>
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
  label: {marginLeft: 10, marginRight: 20},
  labelView: {
    flexDirection: 'column',
  },
});
