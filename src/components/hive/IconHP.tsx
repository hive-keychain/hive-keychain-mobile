import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {HIVEICONBGCOLOR} from 'src/styles/colors';
import Icon from './Icon';

interface Props {
  theme: Theme;
  width?: number;
  heigth?: number;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPowerContainerStyle?: StyleProp<ViewStyle>;
  additionalHiveContainerStyle?: StyleProp<ViewStyle>;
}

const IconHP = ({
  theme,
  width,
  heigth,
  additionalContainerStyle,
  additionalPowerContainerStyle,
  additionalHiveContainerStyle,
}: Props) => {
  return (
    <View style={[additionalContainerStyle]}>
      <Icon
        theme={theme}
        name={Icons.POWER_ICON}
        additionalContainerStyle={[
          styles.powerIcon,
          additionalPowerContainerStyle,
        ]}
      />
      <Icon
        theme={theme}
        name={Icons.HIVE_CURRENCY_LOGO}
        width={width}
        height={heigth}
        additionalContainerStyle={[
          styles.hiveIconContainer,
          additionalHiveContainerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiveIconContainer: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: HIVEICONBGCOLOR,
  },
  powerIcon: {
    position: 'absolute',
    top: -11,
    zIndex: 10,
    left: 13,
    bottom: undefined,
  },
});

export default IconHP;
