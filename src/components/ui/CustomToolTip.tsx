import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import {Tooltip} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
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
  iconColor?: string;
  overlayColor?: string;
  pointerColor?: string;
  children?: JSX.Element[] | JSX.Element;
  theme: Theme;
};

const CustomToolTip = ({
  skipTranslation,
  theme,
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
  children,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <Tooltip
      skipAndroidStatusBar
      popover={
        <Text style={textStyle || styles.text}>
          {skipTranslation ? message : translate(message)}
        </Text>
      }
      containerStyle={containerStyle || styles.container}
      overlayColor={overlayColor || 'transparent'}
      pointerColor={pointerColor || styles.container.backgroundColor}
      width={width || 100}
      height={height || 30}>
      {children || (
        <Icon
          name={Icons.INFO}
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
        />
      )}
    </Tooltip>
  );
};

const getStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: getColors(theme).secondaryText,
      padding: 0,
      margin: 0,
    },
    text: {
      color: getColors(theme).secondaryTextInverted,
      ...body_primary_body_1,
      fontSize: 13,
    },
  });
};

export default CustomToolTip;
