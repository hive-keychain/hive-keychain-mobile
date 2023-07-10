import {loadAccount} from 'actions/hive';
import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {store} from 'store';
import {voteForWitness} from 'utils/hive';
import {translate} from 'utils/localize';

export default ({user}: {user: ActiveAccount}) => {
  const showVoteForWitness = () => {
    if (
      !user.account.name ||
      user.account.proxy?.length ||
      (user.account?.witness_votes &&
        user.account.witness_votes?.includes('stoodkev') &&
        user.account.witness_votes?.includes('cedricguillas'))
    )
      return <></>;
    else {
      const account = user.account.witness_votes.includes('stoodkev')
        ? 'cedricguillas'
        : 'stoodkev';
      return (
        <TouchableOpacity
          style={styles.witness}
          onPress={async () => {
            try {
              if (!user.keys[KeyTypes.active]) {
                Toast.show(translate('drawerFooter.errorActive'), Toast.LONG);
                return;
              }
              if (user.account.witness_votes.length === 30) {
                Toast.show(translate('drawerFooter.error30'), Toast.LONG);
                return;
              }
              await voteForWitness(user.keys[KeyTypes.active], {
                account: user.name,
                witness: account,
                approve: true,
              });
              //@ts-ignore
              store.dispatch(loadAccount(user.name));
              Toast.show(translate('drawerFooter.thanks'), Toast.LONG);
            } catch (e) {
              Toast.show(
                translate('drawerFooter.error') + JSON.stringify(e),
                Toast.LONG,
              );
            }
          }}>
          <Text style={styles.footerText}>
            {translate('drawerFooter.vote', {account})}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{translate('drawerFooter.madeBy')}</Text>
      {showVoteForWitness()}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  footerText: {color: 'white', fontSize: 14},
  witness: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
});
