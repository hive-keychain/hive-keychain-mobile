import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import CustomPicker from './CustomPicker';
import UserProfilePicture from 'components/ui/UserProfilePicture';
import {translate} from 'utils/localize';

const UserPicker = ({username, accounts, onAccountSelected}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});

  if (!username) {
    return null;
  }

  const accountsList = [username, ...accounts.filter((e) => e !== username)];

  return (
    <View style={styles.container}>
      <UserProfilePicture style={styles.image} username={username} />
      <CustomPicker
        list={accountsList}
        onSelected={onAccountSelected}
        selectedValue={username}
        prefix="@"
        prompt={translate('components.picker.prompt_user')}
      />
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
