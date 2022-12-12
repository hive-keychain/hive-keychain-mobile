import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {
  ActionSheetIOS,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

type Props = {
  list: any[];
  selectedValue: any;
  onSelected: (value: any) => void;
  prefix?: string;
  prompt: string;
  style?: StyleProp<TextStyle>;
  dropdownIconColor?: string;
  labelCreator?: (obj: any) => string;
  iosTextStyle?: StyleProp<TextStyle>;
};
const CustomPicker = ({
  list,
  selectedValue,
  onSelected,
  prefix,
  prompt,
  style,
  labelCreator,
  dropdownIconColor,
  iosTextStyle,
}: Props) => {
  const styles = getDimensionedStyles();
  switch (Platform.OS) {
    case 'ios':
      return (
        <TouchableOpacity
          style={[styles.iosContainer, style]}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: labelCreator ? list.map((e) => labelCreator(e)) : list,
              },
              (index) => {
                onSelected(list[index]);
              },
            );
          }}>
          <Text style={[styles.iosLabel, iosTextStyle]}>{`${
            prefix ? prefix : ''
          }${
            labelCreator ? labelCreator(selectedValue) : selectedValue
          }`}</Text>
          <Text style={iosTextStyle}>{'\u25BC'}</Text>
        </TouchableOpacity>
      );
    default:
      return (
        <Picker
          style={[styles.picker, style]}
          selectedValue={selectedValue}
          prompt={prompt}
          dropdownIconColor={dropdownIconColor || 'black'}
          onValueChange={onSelected}>
          {list.map((item, i) => {
            return (
              <Picker.Item
                key={i}
                label={`${prefix ? prefix : ''}${
                  labelCreator ? labelCreator(item) : item
                }`}
                value={item}
              />
            );
          })}
        </Picker>
      );
  }
};

const getDimensionedStyles = () =>
  StyleSheet.create({
    iosContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 20,
    },
    iosLabel: {fontSize: 18},
    picker: {color: 'black', marginLeft: -7},
  });

export default CustomPicker;
