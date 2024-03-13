import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_secondary_body_2,
} from 'src/styles/typography';

interface Props {
  icon: JSX.Element;
  primaryLabel: string;
  onPress: () => void;
  secondaryLabel?: string;
  additionalButtonContainerStyle?: StyleProp<ViewStyle>;
  additionalSquareButtonText?: StyleProp<TextStyle>;
  additionalPrimaryLabelStyle?: StyleProp<TextStyle>;
  additionalSecondaryLabelStyle?: StyleProp<TextStyle>;
  marginRight?: number;
  marginBottom?: number;
}

const SquareButton = ({
  icon,
  primaryLabel,
  secondaryLabel,
  additionalButtonContainerStyle,
  additionalSquareButtonText,
  onPress,
  marginRight = 5,
  marginBottom = 5,
  additionalPrimaryLabelStyle,
  additionalSecondaryLabelStyle,
}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, marginRight, marginBottom, width);
  return (
    <TouchableOpacity
      key={`square-button-${primaryLabel}`}
      onPress={onPress}
      style={[styles.squareButton, additionalButtonContainerStyle]}>
      <View style={styles.flexRowAligned}>
        {icon}
        <View>
          <Text
            style={[
              styles.squareButtonText,
              additionalSquareButtonText,
              additionalPrimaryLabelStyle,
            ]}>
            {primaryLabel}
          </Text>
          {secondaryLabel && (
            <Text
              style={[
                styles.squareButtonText,
                additionalSquareButtonText,
                additionalSecondaryLabelStyle,
              ]}>
              {secondaryLabel}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: Theme,
  marginRight: number,
  marginBottom: number,
  width: number,
) =>
  StyleSheet.create({
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      maxWidth: 200,
      height: 'auto',
      paddingHorizontal: 22,
      paddingVertical: 15,
      marginRight: marginRight ?? 0,
      marginBottom: marginBottom ?? 0,
    },
    flexRowAligned: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    squareButtonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_2,
      lineHeight: 15,
      paddingTop: 4,
      fontSize: getFontSizeSmallDevices(width, title_secondary_body_2.fontSize),
    },
    alignedCenter: {
      alignItems: 'center',
    },
  });

export default SquareButton;
