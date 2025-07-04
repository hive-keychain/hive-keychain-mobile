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
  additionalVscContainerStyle?: StyleProp<ViewStyle>;
  additionalHiveContainerStyle?: StyleProp<ViewStyle>;
}

const IconVscHive = ({
  theme,
  width,
  heigth,
  additionalContainerStyle,
  additionalVscContainerStyle,
  additionalHiveContainerStyle,
}: Props) => {
  return (
    <View style={[additionalContainerStyle]}>
      <Icon
        theme={theme}
        name={Icons.VSC_ICON}
        additionalContainerStyle={[styles.vscIcon, additionalVscContainerStyle]}
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
  vscIcon: {
    position: 'absolute',
    top: -11,
    zIndex: 10,
    right: -5,
    bottom: undefined,
  },
});

export default IconVscHive;
