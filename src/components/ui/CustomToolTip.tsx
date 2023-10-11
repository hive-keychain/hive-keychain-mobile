import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, Text, ViewStyle} from 'react-native';
import {Tooltip} from 'react-native-elements';
import {translate} from 'utils/localize';

type Props = {
  skipTranslation?: boolean;
  message: string;
  textStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  iconWidth?: number;
  iconHeight?: number;
  color?: string;
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
  color,
}: Props) => {
  return (
    <Tooltip
      popover={
        <Text style={textStyle}>
          {skipTranslation ? message : translate(message)}
        </Text>
      }
      width={width ?? 150}
      height={height ?? 40}
      backgroundColor={color}
      skipAndroidStatusBar={true}
      containerStyle={containerStyle}>
      <Icon name="info" width={iconWidth} height={iconHeight} />
    </Tooltip>
  );
};

export default CustomToolTip;
