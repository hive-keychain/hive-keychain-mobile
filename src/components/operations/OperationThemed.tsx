import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {
  ImageStyle,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {CONTENTMARGINPADDING} from 'src/styles/spacing';

interface OperationProps {
  childrenTop?: JSX.Element;
  childrenMiddle: JSX.Element;
  childrenBottom?: JSX.Element;
  additionalContentContainerStyle?: StyleProp<ViewStyle>;
  additionalSVGOpacity?: number;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
}

const OperationThemed = ({
  childrenBottom,
  childrenTop,
  childrenMiddle,
  additionalContentContainerStyle,
  additionalSVGOpacity,
  additionalBgSvgImageStyle,
}: OperationProps) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets(), additionalSVGOpacity);
  //TODO important here bellow:
  //  - related to transfer and every compo using the space-between.
  //  - quentint suggestion:
  //    -> The best for this would be to use flexbox, with flex:1 to get the content element to take the whole screen, and a defined height for the button at the bottom:
  //    - https://stackoverflow.com/questions/52539528/how-to-position-a-view-at-the-bottom-of-a-scrollview

  return (
    <Background
      theme={theme}
      additionalBgSvgImageStyle={[
        styles.backgroundSvgImage,
        additionalBgSvgImageStyle,
      ]}>
      <View style={{flex: 1}}>
        <FocusAwareStatusBar />
        {childrenTop}
        <View
          style={[styles.contentContainer, additionalContentContainerStyle]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {childrenMiddle}
          </ScrollView>
          {childrenBottom}
        </View>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, insets: EdgeInsets, customOpacity?: number) =>
  StyleSheet.create({
    backgroundSvgImage: {
      top: theme === Theme.LIGHT ? -80 : 0,
      opacity: customOpacity ?? 1,
    },
    contentContainer: {
      flex: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorJustDark,
      paddingHorizontal: CONTENTMARGINPADDING,
      justifyContent: 'space-between',
      marginBottom: -insets.bottom,
    },
  });

export default OperationThemed;
