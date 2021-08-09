import KeychainLogo from 'components/ui/KeychainLogo';
import ScreenToggle from 'components/ui/ScreenToggle';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Explore from './Explore';

const NewTab = () => {
  const styles = getStyles(useWindowDimensions().width);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <KeychainLogo width={45} />
        <Text style={styles.title}>
          KEYCHAIN <Text style={styles.home}>HOME</Text>
        </Text>
      </View>
      <ScreenToggle
        menu={['EXPLORE', 'HISTORY', 'FAVORITES']}
        components={[<Explore />]}
        toUpperCase
        style={styles.sub}
      />
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {flex: 1},
    titleContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      marginVertical: '3%',
      height: 45,
    },
    title: {
      marginLeft: '5%',
      color: '#E31337',
      textTransform: 'uppercase',
      fontSize: 26,
      lineHeight: 45,
      fontWeight: 'bold',
    },
    home: {color: 'black'},
    sub: {height: 40},
  });

export default NewTab;
