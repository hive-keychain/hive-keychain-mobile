import Icon from 'components/hive/Icon';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {
  BACKGROUNDITEMDARKISH,
  DARKER_RED_COLOR,
  ICONGRAYBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {getFontSizeSmallDevices, getFormFontStyle} from 'src/styles/typography';
import {formatBalanceCurrency} from 'utils/format';
import {translate} from 'utils/localize';
import SquareButton from './SquareButton';

interface Props {
  theme: Theme;
  height: number;
  currentValue: string;
  availableValue: string;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelTitleStyle?: StyleProp<TextStyle>;
  leftLabelTranslationKey?: string;
  rightLabelTranslationKey?: string;
  onleftClick?: () => void;
  onRightClick?: () => void;
}

const CurrentAvailableBalance = ({
  theme,
  height,
  currentValue,
  availableValue,
  additionalContainerStyle,
  leftLabelTranslationKey,
  rightLabelTranslationKey,
  onleftClick,
  onRightClick,
  additionalLabelTitleStyle,
}: Props) => {
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  const leftLabel = leftLabelTranslationKey
    ? translate(leftLabelTranslationKey)
    : translate('common.current');
  const rightLabel = rightLabelTranslationKey
    ? translate(rightLabelTranslationKey)
    : translate('common.available');

  const handleClick = (value: string, side: 'left' | 'right') => {
    if (side === 'left' && onleftClick) {
      onleftClick();
    } else if (side === 'right' && onRightClick) {
      onRightClick();
    }
  };

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <SquareButton
        icon={
          <Icon
            theme={theme}
            name={Icons.SEND_SQUARE}
            color="#FFF"
            additionalContainerStyle={styles.icon}
          />
        }
        primaryLabel={leftLabel}
        secondaryLabel={formatBalanceCurrency(currentValue)}
        onPress={() => handleClick(currentValue.split(' ')[0], 'left')}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorDarkBlue,
        ]}
        additionalPrimaryLabelStyle={[
          getFormFontStyle(height, theme, 'white').smallLabel,
          styles.current,
          additionalLabelTitleStyle,
        ]}
        additionalSecondaryLabelStyle={styles.available}
        additionalSquareButtonText={styles.whiteText}
      />
      <SquareButton
        icon={
          <Icon
            theme={theme}
            name={Icons.EMPTY_WALLET}
            color="#FFF"
            additionalContainerStyle={styles.icon}
          />
        }
        primaryLabel={rightLabel}
        secondaryLabel={formatBalanceCurrency(availableValue)}
        onPress={() => handleClick(availableValue.split(' ')[0], 'right')}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorRed,
          styles.buttonContainerRed,
        ]}
        additionalPrimaryLabelStyle={[
          getFormFontStyle(height, theme, 'white').smallLabel,
          styles.current,
          additionalLabelTitleStyle,
        ]}
        additionalSecondaryLabelStyle={styles.available}
        additionalSquareButtonText={styles.whiteText}
      />
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      width: '48%',
      borderColor: getColors(theme).cardBorderColorJustDark,
      borderWidth: theme === Theme.DARK ? 1 : 0,
      borderRadius: 13,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    buttonContainerRed: {
      borderWidth: 0,
    },
    backgroundColorDarkBlue: {
      backgroundColor: BACKGROUNDITEMDARKISH,
    },
    backgroundColorRed: {
      backgroundColor: DARKER_RED_COLOR,
    },
    current: {
      opacity: 0.7,
    },
    available: {
      fontSize: getFontSizeSmallDevices(width, 18),
    },
    whiteText: {
      color: '#FFF',
    },
    icon: {
      borderRadius: 11.2,
      padding: 5,
      backgroundColor: ICONGRAYBGCOLOR,
      marginRight: 5,
    },
  });

export default CurrentAvailableBalance;
