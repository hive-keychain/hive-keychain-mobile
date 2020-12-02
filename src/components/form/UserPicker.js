import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Picker} from '@react-native-community/picker';
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
    // if (value === 'add_new_account') {
    //   addAccount();
    // } else {
    //   onAccountSelected(value);
    // }
    onAccountSelected(value);
  };

  return (
    <View style={styles.container}>
      <UserProfilePicture style={styles.image} username={username} />
      <View style={styles.subContainer}>
        <Picker
          style={styles.picker}
          selectedValue={username}
          prompt={translate('components.picker.prompt')}
          onValueChange={onPickerValueChanged}>
          {accountsList.map((account) => (
            <Picker.Item key={account} label={`@${account}`} value={account} />
          ))}
        </Picker>
      </View>
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
  });

export default UserPicker;
