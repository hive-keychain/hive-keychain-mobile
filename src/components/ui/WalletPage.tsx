import React from 'react';
import {ImageStyle, StatusBar, StyleProp, StyleSheet, View} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import Background from './Background';

type Props = {
  children: JSX.Element;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
};

export default ({children, additionalBgSvgImageStyle}: Props) => {
  const {theme} = useThemeContext();
  return (
    <Background
      theme={theme}
      additionalBgSvgImageStyle={additionalBgSvgImageStyle}>
      <View style={styles.bgd}>
        <StatusBar
          barStyle={getColors(theme).barStyle}
          backgroundColor={getColors(theme).primaryBackground}
        />
        {children}
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%'},
});
