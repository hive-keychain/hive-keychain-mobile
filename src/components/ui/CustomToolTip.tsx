import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Icons} from 'src/enums/icons.enums';

type Props = {
  skipTranslation?: boolean;
  message: string;
  textStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  iconWidth?: number;
  iconHeight?: number;
  iconColor?: string;
  overlayColor?: string;
  pointerColor?: string;
};

const CustomToolTip = ({
  skipTranslation,
  message,
  textStyle,
  containerStyle,
  width,
  height,
  iconHeight,
  iconWidth,
  iconColor,
  overlayColor,
  pointerColor,
}: Props) => {
  return (
    // <Tooltip
    //   skipAndroidStatusBar
    //   popover={
    //     <Text style={textStyle}>
    //       {skipTranslation ? message : translate(message)}
    //     </Text>
    //   }
    //   width={width ?? 150}
    //   height={height ?? 40}
    //   containerStyle={containerStyle}
    //   overlayColor={overlayColor}
    //   pointerColor={pointerColor}>
    <Icon
      name={Icons.INFO}
      color={iconColor}
      width={iconWidth}
      height={iconHeight}
    />
    // </Tooltip>
  );
};

export default CustomToolTip;
