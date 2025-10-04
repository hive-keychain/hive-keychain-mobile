import Icon from 'components/hive/Icon';
import React, {memo} from 'react';
import {StyleProp, Text, TextStyle, ViewStyle} from 'react-native';
import {Tooltip} from 'react-native-elements';
import {Icons} from 'src/enums/icons.enum';
import {translate} from 'utils/localize';

type Props = {
  skipTranslation?: boolean;
  message: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  iconWidth?: number;
  iconHeight?: number;
  iconColor?: string;
  overlayColor?: string;
  pointerColor?: string;
  children?: React.ReactNode;
};

const CustomToolTip = ({
  skipTranslation,
  message,
  textStyle,
  containerStyle,
  width = 150,
  height = 40,
  iconHeight = 18,
  iconWidth = 18,
  iconColor,
  overlayColor = 'transparent',
  pointerColor,
  children,
}: Props) => {
  const ElementsTooltip = Tooltip as unknown as React.ComponentType<any>;

  return (
    <ElementsTooltip
      skipAndroidStatusBar
      popover={
        <Text style={textStyle}>
          {skipTranslation ? message : translate(message)}
        </Text>
      }
      width={width}
      height={height}
      containerStyle={containerStyle}
      {...(overlayColor ? {overlayColor} : {})}
      {...(pointerColor ? {pointerColor} : {})}>
      {children ? (
        children
      ) : (
        <Icon
          name={Icons.INFO}
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
        />
      )}
    </ElementsTooltip>
  );
};

export default memo(CustomToolTip);
