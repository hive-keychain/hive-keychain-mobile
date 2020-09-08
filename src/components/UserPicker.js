import React from 'react';
import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {translate} from 'utils/localize';

const UserPicker = ({
  activeAccount,
  accounts,
  onAccountSelected,
  addAccount,
}) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  if (!activeAccount.json_metadata) {
    return null;
  }
  const activeAccountName = activeAccount.name;

  const accountsList = [
    activeAccountName,
    ...accounts.filter((e) => e !== activeAccountName),
  ];

  const onPickerValueChanged = (value) => {
    if (value === 'add_new_account') {
      addAccount();
    } else {
      onAccountSelected(value);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{uri: `https://images.hive.blog/u/${activeAccountName}/avatar`}}
      />
      <Picker
        style={styles.picker}
        selectedValue={activeAccountName}
        prompt={translate('components.picker.prompt')}
        onValueChange={onPickerValueChanged}>
        {accountsList.map((account) => (
          <Picker.Item key={account} label={`@${account}`} value={account} />
        ))}
        <Picker.Item
          key="add_new_account"
          label={translate('components.picker.add_account')}
          value="add_new_account"
        />
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
    image: {
      margin: 2,
      width: height / 15 - 4,
      height: height / 15 - 4,
      borderRadius: height / 30,
    },
  });

export default UserPicker;
