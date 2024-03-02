import SafeArea from 'components/ui/SafeArea';
import React from 'react';
import {ImageStyle, StatusBar, StyleProp, StyleSheet} from 'react-native';
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
      <SafeArea style={styles.bgd}>
        <StatusBar
          barStyle={getColors(theme).barStyle}
          backgroundColor={getColors(theme).primaryBackground}
        />
        {children}
      </SafeArea>
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%'},
});
