import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  ActionSheetIOS,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {translate} from 'utils/localize';
import UserProfilePicture from 'components/ui/UserProfilePicture';

const UserPicker = ({username, accounts, onAccountSelected}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});

  if (!username) {
    return null;
  }

  const accountsList = [username, ...accounts.filter((e) => e !== username)];
  const onPickerValueChanged = (value) => {
    onAccountSelected(value);
  };
  const renderPicker = () => {
    switch (Platform.OS) {
      case 'ios':
        return (
          <TouchableOpacity
            style={styles.iosContainer}
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: accountsList,
                },
                (index) => {
                  onPickerValueChanged(accountsList[index]);
                },
              );
            }}>
            <Text style={styles.iosLabel}>@{username}</Text>
            <Text>{'\u25BC'}</Text>
          </TouchableOpacity>
        );
      case 'android':
        return (
          <Picker
            style={styles.picker}
            selectedValue={username}
            prompt={translate('components.picker.prompt')}
            onValueChange={onPickerValueChanged}>
            {accountsList.map((account) => (
              <Picker.Item
                key={account}
                label={`@${account}`}
                value={account}
              />
            ))}
          </Picker>
        );
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <UserProfilePicture style={styles.image} username={username} />
      <View style={styles.subContainer}>{renderPicker()}</View>
    </View>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      marginHorizontal: width * 0.05,
      backgroundColor: '#E5EEF7',
      borderRadius: height / 30,
      marginVertical: height / 30,
    },
    subContainer: {
      width: '80%',
      marginLeft: width * 0.04,
    },
    image: {
      margin: 2,
      width: height / 15 - 4,
      height: height / 15 - 4,
      borderRadius: height / 30,
    },
    iosContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 20,
    },
    iosLabel: {fontSize: 18},
  });

export default UserPicker;
