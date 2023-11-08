import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
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
  setMaxAvailable?: (value: string) => void;
}

const CurrentAvailableBalance = ({
  theme,
  currentValue,
  availableValue,
  additionalContainerStyle,
  setMaxAvailable,
}: Props) => {
  const styles = getStyles(theme);

  const handleSetMaxAvailable = (value: string) => {
    if (setMaxAvailable) setMaxAvailable(value);
  };

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <SquareButton
        icon={
          <Icon
            theme={theme}
            name="send_square"
            color="#FFF"
            additionalContainerStyle={styles.icon}
          />
        }
        primaryLabel={translate('common.current')}
        secondaryLabel={currentValue}
        onPress={() => {}}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorDarkBlue,
        ]}
        additionalPrimaryLabelStyle={styles.current}
        additionalSecondaryLabelStyle={styles.available}
        additionalSquareButtonText={styles.whiteText}
      />
      <SquareButton
        icon={
          <Icon
            theme={theme}
            name="empty_wallet"
            color="#FFF"
            additionalContainerStyle={styles.icon}
          />
        }
        primaryLabel={translate('common.available')}
        secondaryLabel={availableValue}
        onPress={() => handleSetMaxAvailable(availableValue.split(' ')[0])}
        additionalButtonContainerStyle={[
          styles.buttonContainer,
          styles.backgroundColorRed,
        ]}
        additionalPrimaryLabelStyle={styles.current}
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
