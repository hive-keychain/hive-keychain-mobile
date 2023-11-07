import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {title_secondary_body_2} from 'src/styles/typography';

interface Props {
  icon: JSX.Element;
  primaryLabel: string;
  onPress: () => void;
  secondaryLabel?: string;
  additionalButtonContainerStyle?: StyleProp<ViewStyle>;
  additionalSquareButtonText?: StyleProp<TextStyle>;
}

const SquareButton = ({
  icon,
  primaryLabel,
  secondaryLabel,
  additionalButtonContainerStyle,
  additionalSquareButtonText,
  onPress,
}: Props) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      key={`square-button-${primaryLabel}`}
      onPress={onPress}
      style={[styles.squareButton, additionalButtonContainerStyle]}>
      <View style={styles.flexRowAligned}>
        {icon}
        <View>
          <Text style={[styles.squareButtonText, additionalSquareButtonText]}>
            {primaryLabel}
          </Text>
          {secondaryLabel && (
            <Text style={[styles.squareButtonText, additionalSquareButtonText]}>
              {secondaryLabel}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      width: '30%',
      height: 'auto',
      paddingHorizontal: 22,
      paddingVertical: 15,
    },
    flexRowAligned: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    squareButtonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_2,
      fontSize: 9,
    },
    alignedCenter: {
      alignItems: 'center',
    },
  });

export default SquareButton;
