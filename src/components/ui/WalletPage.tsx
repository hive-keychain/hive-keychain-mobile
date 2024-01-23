import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import React from 'react';
import {ImageStyle, StyleProp, StyleSheet} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
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
        <FocusAwareStatusBar />
        {children}
      </SafeArea>
    </Background>
  );
};

const styles = StyleSheet.create({
  bgd: {width: '100%', height: '100%'},
});
