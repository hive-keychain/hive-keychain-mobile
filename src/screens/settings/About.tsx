import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {AboutNavigation} from 'navigators/MainDrawer.types';
import React from 'react';
import {Linking, StatusBar, StyleSheet, Text, View} from 'react-native';
import VersionInfo from 'react-native-version-info';

export default ({navigation}: {navigation: AboutNavigation}) => {
  useLockedPortrait(navigation);

  return (
    <Background>
      <>
        <StatusBar backgroundColor="black" />
        <Separator height={50} />
        <View style={styles.container}>
          <Text style={styles.title}>
            Keychain Mobile v{VersionInfo.appVersion} (Beta)
          </Text>
          <Text style={styles.text}>
            Keychain for mobile is developed by{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://peakd.com/@stoodkev');
              }}>
              @stoodkev
            </Text>{' '}
            and designed by{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://peakd.com/@nateaguila');
              }}>
              @nateaguila
            </Text>
            .
          </Text>
          <Separator height={20} />
          <Text style={styles.text}>
            It originates from Hive Keychain, a browser extension imagined by
            the Splinterlands' funders{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://peakd.com/@yabapmatt');
              }}>
              @yabapmatt
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://peakd.com/@aggroed');
              }}>
              @aggroed
            </Text>
            .
          </Text>
          <Separator height={20} />
          <Text style={styles.text}>
            Since the application is still in Beta, we count on you to report
            bugs, layout issues and improvement ideas on our{' '}
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
