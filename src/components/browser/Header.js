import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {translate} from 'utils/localize';

const BrowserHeader = ({browser: {activeTab, tabs}}) => {
  const renderText = () => {
    if (activeTab) {
      const activeUrl = tabs.find((e) => e.id === activeTab).url;
      return (
        <Text style={styles.url}>{activeUrl.replace('https://', '')}</Text>
      );
    } else {
      return (
        <Text style={styles.browser}>{translate('navigation.browser')}</Text>
      );
    }
  };
  return <View style={styles.container}>{renderText()}</View>;
};

const styles = StyleSheet.create({
  container: {width: '100%'},
  url: {color: 'white', fontSize: 18},
  browser: {color: 'white', fontSize: 18, fontWeight: 'bold'},
});
const mapStateToProps = (state) => ({browser: state.browser});

export default connect(mapStateToProps)(BrowserHeader);
