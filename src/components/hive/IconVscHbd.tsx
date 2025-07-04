import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {HBDICONBGCOLOR, HIVEICONBGCOLOR} from 'src/styles/colors';
import Icon from './Icon';

interface Props {
  theme: Theme;
  width?: number;
  heigth?: number;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalVscContainerStyle?: StyleProp<ViewStyle>;
  additionalHbdContainerStyle?: StyleProp<ViewStyle>;
}

const IconVscHbd = ({
  theme,
  width,
  heigth,
  additionalContainerStyle,
  additionalVscContainerStyle,
  additionalHbdContainerStyle,
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
        name={Icons.HBD_CURRENCY_LOGO}
        width={width}
        height={heigth}
        additionalContainerStyle={[
          styles.hbdIconContainer,
          additionalHbdContainerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hbdIconContainer: {
    borderRadius: 50,
    padding: 5,
    backgroundColor: HBDICONBGCOLOR,
  },
  vscIcon: {
    position: 'absolute',
    top: -11,
    zIndex: 10,
    right: -5,
    bottom: undefined,
  },
});

export default IconVscHbd;
