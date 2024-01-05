import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
//TODO find a better way to add renderBottomBg as hexagons bellow as design
interface OperationProps {
  childrenTop?: JSX.Element;
  childrenMiddle: JSX.Element;
  childrenBottom?: JSX.Element;
  additionalContentContainerStyle?: StyleProp<ViewStyle>;
  additionalSVGOpacity?: number;
}

const OperationThemed = ({
  childrenBottom,
  childrenTop,
  childrenMiddle,
  additionalContentContainerStyle,
  additionalSVGOpacity,
}: OperationProps) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, additionalSVGOpacity);

  return (
    <Background
      theme={theme}
      additionalBgSvgImageStyle={styles.backgroundSvgImage}>
      <View style={{flex: 1}}>
        <FocusAwareStatusBar />
        {childrenTop}
        <View
          style={[styles.contentContainer, additionalContentContainerStyle]}>
          <ScrollView>{childrenMiddle}</ScrollView>
          {childrenBottom}
        </View>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, customOpacity?: number) =>
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
      paddingHorizontal: 10,
      justifyContent: 'space-between',
    },
  });

export default OperationThemed;
