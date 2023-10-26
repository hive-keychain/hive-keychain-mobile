import Background from 'components/ui/Background';
import {BackgroundHexagons} from 'components/ui/BackgroundHexagons';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React, {useContext} from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
//TODO when finishing the UI refactor, check if can be merged with old one, check
interface OperationProps {
  childrenTop?: JSX.Element;
  childrenMiddle: JSX.Element;
  childrenBottom?: JSX.Element;
  renderBottomBg?: boolean;
  additionalContentContainerStyle?: StyleProp<ViewStyle>;
}

const OperationThemed = ({
  childrenBottom,
  childrenTop,
  childrenMiddle,
  renderBottomBg,
  additionalContentContainerStyle,
}: OperationProps) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Background
      using_new_ui
      theme={theme}
      additionalBgSvgImageStyle={styles.backgroundSvgImage}>
      <>
        <FocusAwareStatusBar />
        {childrenTop}
        <View
          style={[styles.contentContainer, additionalContentContainerStyle]}>
          {renderBottomBg && <BackgroundHexagons theme={theme} />}
          <ScrollView>{childrenMiddle}</ScrollView>
          {childrenBottom}
        </View>
      </>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    backgroundSvgImage: {
      top: theme === Theme.LIGHT ? -80 : 0,
      opacity: 1,
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
