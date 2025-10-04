import React from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ICON_COMPONENTS} from 'src/enums/icons.enum';
// All icon components are resolved via ICON_COMPONENTS mapping
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getColors} from 'src/styles/colors';

const smallerIconSizeNameList = [
  Icons.TRANSFER,
  Icons.RECURRENT_TRANSFER,
  Icons.FILL_RECURRENT_TRANSFER,
  Icons.CONVERT,
];

const getIconFilePath = (
  name: Icons,
  subType: string,
  style: any,
  marginRight?: boolean,
  theme?: Theme,
  width: number = 20,
  height: number = 20,
  color?: string,
  fill?: string,
  strokeWidth?: number,
) => {
  const finalStyleOnIcon = marginRight ? styles.defaultIconContainer : style;
  let dimensionsProps = {
    width,
    height,
  };
  if (smallerIconSizeNameList.includes(name)) {
    dimensionsProps = {width: width * 1.2, height: height * 1.2};
  }

  const IconComponent = ICON_COMPONENTS[name];
  if (!IconComponent) return null as unknown as React.JSX.Element;

  const baseColor = color ?? getColors(theme).icon;
  const overrideColor =
    name === Icons.AT ? getColors(theme).secodaryIconBW : baseColor;

  if (name === Icons.POWER_UP_DOWN) {
    const extraStyle =
      subType === 'withdraw_vesting' ? [styles.rotationUpDown] : undefined;
    return (
      <IconComponent
        style={[finalStyleOnIcon, {color: overrideColor}, extraStyle]}
        {...dimensionsProps}
        fill={fill}
        strokeWidth={strokeWidth}
      />
    );
  }
  const additionalProps: any = dimensionsProps;
  if (fill) {
    additionalProps.fill = fill;
  }
  if (strokeWidth) {
    additionalProps.strokeWidth = strokeWidth;
  }

  return (
    <IconComponent
      style={[finalStyleOnIcon, {color: overrideColor}]}
      {...additionalProps}
    />
  );
};

interface IconProps {
  onPress?: () => void;
  onLongPress?: () => void;
  name: Icons;
  subType?: string;
  marginRight?: boolean;
  theme?: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPressedStyle?: StyleProp<ViewStyle>;
  bgImage?: React.JSX.Element;
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

const Icon = (props: IconProps) => {
  let iconComponent: React.JSX.Element = getIconFilePath(
    props.name,
    props.subType,
    styles.defaultIcon,
    props.marginRight,
    props.theme,
    props.width,
    props.height,
    props.color,
    props.fill,
    props.strokeWidth,
  );
  const styleProps = {
    style: [styles.defaultIconContainer, props.additionalContainerStyle],
  };

  if (props.bgImage) {
    iconComponent = (
      <>
        <View style={styles.bgIcon}>{props.bgImage}</View>
        {iconComponent}
      </>
    );
  }

  return props.onPress ? (
    <Pressable
      style={({pressed}) => [
        styleProps.style,
        pressed ? props.additionalPressedStyle : null,
      ]}
      onPress={() => props.onPress()}
      onLongPress={props.onLongPress ? () => props.onLongPress() : null}>
      {iconComponent}
    </Pressable>
  ) : (
    <View {...styleProps}>{iconComponent}</View>
  );
};

const styles = StyleSheet.create({
  defaultIcon: {},
  defaultIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  bgIcon: {
    position: 'absolute',
  },
  rotationUpDown: {
    transform: [{rotateX: '180deg'}],
  },
});

export default Icon;
