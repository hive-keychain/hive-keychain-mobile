import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import DrawerButton from 'components/ui/DrawerButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BrowserHeader = ({browser: {activeTab, tabs}, navigation, route}) => {
  const {HEADER_HEIGHT} = BrowserConfig;
  const insets = useSafeAreaInsets();

  const styles = getStyles(HEADER_HEIGHT, insets);

  const renderText = () => {
    if (activeTab) {
      const activeUrl = tabs.find((e) => e.id === activeTab).url;
      return (
        <Text style={styles.url}>{urlTransformer(activeUrl).hostname}</Text>
      );
    } else {
      return (
        <Text style={styles.browser}>{translate('navigation.browser')}</Text>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>{renderText()}</View>
      <DrawerButton navigation={navigation} />
    </View>
  );
};

const getStyles = (height, insets) =>
  StyleSheet.create({
    container: {
      height: height + insets.top,
      backgroundColor: 'black',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingLeft: 20,
    },
    textContainer: {width: '60%'},
    url: {color: 'white', fontSize: 18},
    browser: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  });

const mapStateToProps = (state) => ({browser: state.browser});

export default connect(mapStateToProps)(BrowserHeader);
