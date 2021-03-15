import React, {useState} from 'react';
import {Text, StyleSheet, View, Animated} from 'react-native';
import {connect} from 'react-redux';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import DrawerButton from 'components/ui/DrawerButton';

const BrowserHeader = ({browser: {activeTab, tabs}, navigation, route}) => {
  const {HEADER_HEIGHT} = BrowserConfig;
  useState(() => {
    const scrollY = new Animated.Value(0);
    const diffClampHeader = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
    const translateYHeader = diffClampHeader.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -1 * HEADER_HEIGHT],
    });
    navigation.setParams({scrollYHeader: scrollY, translateYHeader});
  }, [HEADER_HEIGHT, navigation]);
  const styles = getStyles(HEADER_HEIGHT);

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
    <Animated.View
      style={{
        transform: [
          {translateY: route.params ? route.params.translateYHeader : 0},
        ],
        height: HEADER_HEIGHT,
      }}>
      <View style={styles.container}>
        <View style={styles.textContainer}>{renderText()}</View>
        <DrawerButton navigation={navigation} />
      </View>
    </Animated.View>
  );
};

const getStyles = (height) =>
  StyleSheet.create({
    container: {
      height,
      backgroundColor: 'black',
      width: '100%',
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 2,
      zIndex: 2,
      paddingLeft: 20,
    },
    textContainer: {width: '60%'},
    url: {color: 'white', fontSize: 18},
    browser: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  });

const mapStateToProps = (state) => ({browser: state.browser});

export default connect(mapStateToProps)(BrowserHeader);
