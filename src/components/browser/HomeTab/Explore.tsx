import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {BrowserConfig} from 'utils/config';
import Category, {Category as CategoryType} from './components/Category';

export default () => {
  const {categories} = BrowserConfig.HomeTab;
  const styles = getStyles(useWindowDimensions().width);

  return (
    <View style={styles.container}>
      {categories.map((cat: CategoryType) => (
        <Category category={cat} key={cat.title} />
      ))}
      <View style={styles.footer}>
        <Text style={styles.text}>
          Can't see your favorite Hive dApp in here?
        </Text>
        <Text style={styles.text}>
          Contact us on{' '}
          <Text
            style={{fontWeight: 'bold'}}
            onPress={() => {
              Linking.openURL('https://discord.gg/tUHtyev2xF');
            }}>
            Discord
          </Text>
          !
        </Text>
      </View>
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: '#E5EEF7',
      flex: 1,
      marginTop: 50,
    },
    footer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {fontSize: 16},
  });
