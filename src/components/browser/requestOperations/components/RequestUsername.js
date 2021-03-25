import React from 'react';
import RequestItem, {getTitle} from './RequestItem';
import {translate} from 'utils/localize';
import {View, StyleSheet} from 'react-native';
import CustomPicker from 'components/form/CustomPicker';

export default ({username, accounts, account, setAccount}) => {
  return username ? (
    <RequestItem
      title={translate('request.item.username')}
      content={`@${username}`}
    />
  ) : (
    <View style={styles.container}>
      {getTitle({title: translate('request.item.username')})}
      <CustomPicker
        list={accounts.map((e) => e.name)}
        selectedValue={account}
        style={styles.picker}
        onSelectedValue={(acc) => {
          setAccount(accounts.find((a) => a.name === acc));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%'},
  picker: {marginTop: -10, marginBottom: -10},
});
