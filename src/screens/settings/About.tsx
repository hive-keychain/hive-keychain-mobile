import Clipboard from '@react-native-community/clipboard';
import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {AboutNavigation} from 'navigators/MainDrawer.types';
import React, {useState} from 'react';
import {Linking, StatusBar, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import VersionInfo from 'react-native-version-info';
import {getSafeState} from 'store';

export default ({navigation}: {navigation: AboutNavigation}) => {
  useLockedPortrait(navigation);
  const [pressed, setPressed] = useState(0);
  return (
    <Background>
      <>
        <StatusBar backgroundColor="black" />
        <Separator height={50} />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              if (pressed < 4) {
                setPressed(pressed + 1);
              } else {
                Clipboard.setString(JSON.stringify(getSafeState()));
                SimpleToast.show(
                  'Debug Mode : The Application state has been copied to the clipboard. Contact our team to help you debug.',
                  SimpleToast.LONG,
                );
              }
            }}>
            <Text style={styles.title}>
              Keychain Mobile v{VersionInfo.appVersion} (Beta)
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>
            Hive Keychain for mobile is developed by the Keychain team and
            founded through the Hive DAO.
          </Text>
          <Separator height={20} />
          <Text style={styles.text}>
            Process transactions and enjoy your favorite dApps on your mobile
            device!
          </Text>
          <Separator height={20} />
          <Text style={styles.text}>
            Should you encounter any issue, contact us on our{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://discord.gg/3EM6YfRrGv');
              }}>
              Discord server
            </Text>{' '}
            or on{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL(
                  'https://github.com/stoodkev/hive-keychain-mobile',
                );
              }}>
              Github.
            </Text>
          </Text>
        </View>
      </>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 60, marginHorizontal: 20},
  link: {color: 'lightgrey'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  text: {color: 'white', fontSize: 16, textAlign: 'justify'},
});
