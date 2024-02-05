import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {
  BACKGROUNDITEMDARKISH,
  DARKER_RED_COLOR,
  ICONGRAYBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {translate} from 'utils/localize';
import SquareButton from './SquareButton';

interface Props {
  theme: Theme;
  currentValue: string;
  availableValue: string;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelTitleStyle?: StyleProp<TextStyle>;
  setMaxAvailable?: (value: string) => void;
  leftLabelTranslationKey?: string;
  rightLabelTranslationKey?: string;
  onleftClick?: () => void;
  onRightClick?: () => void;
}

const CurrentAvailableBalance = ({
  theme,
  currentValue,
  availableValue,
  additionalContainerStyle,
  setMaxAvailable,
  leftLabelTranslationKey,
  rightLabelTranslationKey,
  onleftClick,
  onRightClick,
  additionalLabelTitleStyle,
}: Props) => {
  const styles = getStyles(theme);

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
    } else {
      if (setMaxAvailable) setMaxAvailable(value);
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
        secondaryLabel={currentValue}
        onPress={() => handleClick(currentValue.split(' ')[0], 'left')}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorDarkBlue,
        ]}
        additionalPrimaryLabelStyle={[
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
        secondaryLabel={availableValue}
        onPress={() => handleClick(availableValue.split(' ')[0], 'right')}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorRed,
        ]}
        additionalPrimaryLabelStyle={[
          styles.current,
          additionalLabelTitleStyle,
        ]}
        additionalSecondaryLabelStyle={styles.available}
        additionalSquareButtonText={styles.whiteText}
      />
    </View>
  );
};

const getStyles = (theme: Theme) =>
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
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    backgroundColorDarkBlue: {
      backgroundColor: BACKGROUNDITEMDARKISH,
    },
    backgroundColorRed: {
      backgroundColor: DARKER_RED_COLOR,
    },
    current: {
      fontSize: 12,
      opacity: 0.7,
    },
    available: {
      fontSize: 18,
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
