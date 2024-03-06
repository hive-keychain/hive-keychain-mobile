import {KeyTypes} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
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
  useWindowDimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {CONTENT_MARGIN_PADDING} from 'src/styles/spacing';
import {translate} from 'utils/localize';

interface OperationProps {
  childrenTop?: JSX.Element;
  childrenMiddle: JSX.Element;
  additionalContentContainerStyle?: StyleProp<ViewStyle>;
  additionalSVGOpacity?: number;
  additionalBgSvgImageStyle?: StyleProp<ImageStyle>;
  onNext?: () => void;
  buttonTitle?: string;
  method?: KeyTypes;
}

const OperationThemed = ({
  childrenTop,
  childrenMiddle,
  additionalSVGOpacity,
  additionalBgSvgImageStyle,
  onNext,
  method,
  buttonTitle,
}: OperationProps) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets(), additionalSVGOpacity);
  const {width, height} = useWindowDimensions();

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
      <>
        <FocusAwareStatusBar />
        <View style={{flex: 1}}>
          {childrenTop}
          <View style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={[styles.contentContainer]}
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled">
              {childrenMiddle}
              {onNext && buttonTitle && (
                <ActiveOperationButton
                  method={method || KeyTypes.active}
                  title={translate(buttonTitle)}
                  onPress={onNext}
                  style={[
                    getButtonStyle(theme, height).warningStyleButton,
                    {
                      marginBottom: 30,
                    },
                  ]}
                  isLoading={false}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </>
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
      flexGrow: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorJustDark,
      paddingHorizontal: CONTENT_MARGIN_PADDING,
      justifyContent: 'space-between',
      marginBottom: -insets.bottom,
    },
  });

export default OperationThemed;
