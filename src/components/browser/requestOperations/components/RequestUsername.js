import React from 'react';
import RequestItem from './RequestItem';
import {translate} from 'utils/localize';
import {View, StyleSheet} from 'react-native';
import UserPicker from 'components/form/UserPicker';

export default ({username, accounts, account, setAccount}) => {
  return username ? (
    <RequestItem
      title={translate('request.item.username')}
      content={`@${username}`}
    />
  ) : (
    <View style={styles.container}>
      <UserPicker
        accounts={accounts.map((e) => e.name)}
        username={account}
        noSort
        onAccountSelected={(acc) => {
          setAccount(acc);
        }}
        style={styles.picker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', marginTop: -30},
});
