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
  loading?: boolean;
  inScrollView?: boolean;
}

const OperationThemed = ({
  childrenTop,
  childrenMiddle,
  additionalSVGOpacity,
  additionalBgSvgImageStyle,
  onNext,
  method,
  buttonTitle,
  loading = false,
  inScrollView = true,
}: OperationProps) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useSafeAreaInsets(), additionalSVGOpacity);
  const {width, height} = useWindowDimensions();

  const renderContent = () => (
    <>
      {childrenMiddle}
      {onNext && buttonTitle && (
        <ActiveOperationButton
          method={method || KeyTypes.active}
          title={translate(buttonTitle)}
          onPress={onNext}
          style={[
            getButtonStyle(theme, width).warningStyleButton,
            {
              marginBottom: 30,
            },
          ]}
          isLoading={loading}
        />
      )}
    </>
  );

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
            {inScrollView ? (
              <ScrollView
                contentContainerStyle={[styles.contentContainer]}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled">
                {renderContent()}
              </ScrollView>
            ) : (
              <View style={[styles.contentContainer]}>{renderContent()}</View>
            )}
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
