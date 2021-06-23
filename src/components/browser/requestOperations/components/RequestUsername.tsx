import {account} from 'actions/interfaces';
import UserPicker from 'components/form/UserPicker';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {translate} from 'utils/localize';
import RequestItem from './RequestItem';

type Props = {
  username: string;
  accounts: account[];
  account: string;
  setAccount: (account: string) => void;
};
export default ({username, accounts, account, setAccount}: Props) => {
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
        onAccountSelected={(acc) => {
          setAccount(acc);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', marginTop: -30},
});
