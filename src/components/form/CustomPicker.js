import React from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  ActionSheetIOS,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {translate} from 'utils/localize';

const CustomPicker = ({list, selectedValue, onSelected, prefix}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});
  switch (Platform.OS) {
    case 'ios':
      return (
        <TouchableOpacity
          style={styles.iosContainer}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: list,
              },
              (index) => {
                onSelected(list[index]);
              },
            );
          }}>
          <Text style={styles.iosLabel}>{`${
            prefix ? prefix : ''
          }{selectedValue}`}</Text>
          <Text>{'\u25BC'}</Text>
        </TouchableOpacity>
      );
    case 'android':
      console.log(list, selectedValue, onSelected);

      return (
        <Picker
          style={styles.picker}
          selectedValue={selectedValue}
          prompt={translate('components.picker.prompt')}
          onValueChange={onSelected}>
          {list.map((item) => {
            console.log(item);
            return (
              <Picker.Item
                key={item}
                label={`${prefix ? prefix : ''}${item}`}
                value={item}
              />
            );
          })}
        </Picker>
      );
    default:
      break;
  }
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    iosContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 20,
    },
    iosLabel: {fontSize: 18},
    picker: {width: '100%', color: 'black'},
  });

export default CustomPicker;
