import React from 'react';
import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {translate} from 'utils/localize';

const UserPicker = ({activeAccount, accounts, onAccountSelected}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  if (!activeAccount.json_metadata) {
    return null;
  }
  const activeAccountName = activeAccount.name;
  const activeAccountPhoto = JSON.parse(
    activeAccount.json_metadata,
  ).profile.profile_image.split('?')[0];
  console.log(activeAccountPhoto);

  const accountsList = [
    activeAccountName,
    ...accounts.filter((e) => e !== activeAccountName),
  ];

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: activeAccountPhoto}} />
      <Picker
        style={styles.picker}
        selectedValue={activeAccountName}
        prompt={translate('components.picker.prompt')}
        onValueChange={onAccountSelected}>
        {accountsList.map((account) => (
          <Picker.Item key={account} label={`@${account}`} value={account} />
        ))}
      </Picker>
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
    picker: {
      width: '50%',
      backgroundColor: '#E5EEF7',
      textAlign: 'center',
      marginLeft: width * 0.15,
    },
    image: {width: height / 15, height: height / 15, borderRadius: height / 30},
  });

export default UserPicker;
