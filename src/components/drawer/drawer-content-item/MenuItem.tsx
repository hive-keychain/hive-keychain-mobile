import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  Pressable,
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {PADDING_LEFT_MAIN_MENU} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface PropsDrawerContentItem {
  labelTranslationKey: string;
  theme: Theme;
  onPress: () => void;
  iconImage: React.JSX.Element;
  iconName?: Icons;
  leftSideComponent?: React.JSX.Element;
  drawBottomLine?: boolean;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPressedStyle?: StyleProp<ViewStyle>;
  additionalLeftSideComponentStyle?: StyleProp<ViewStyle>;
}

type Props = PropsDrawerContentItem;

const MenuItem = (props: Props) => {
  const dimensions = useWindowDimensions();
  const {height} = dimensions;
  const styles = getStyles(props.theme, dimensions, !!props.leftSideComponent);

  const renderIcon = () => {
    return props.iconName ? (
      <Icon
        theme={props.theme}
        name={Icons.SCANNER}
        color={PRIMARY_RED_COLOR}
      />
    ) : (
      props.iconImage
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.onPress}
      style={[styles.container, props.additionalContainerStyle]}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={[styles.flexShrinkHeightFixed]}>
        <View
          style={[
            styles.flexRowStart,
            props.leftSideComponent ? styles.flexBetween : null,
          ]}>
          <Pressable
            style={({pressed}) =>
              pressed ? props.additionalPressedStyle : null
            }
            onPress={props.onPress}>
            <Text style={[styles.labelStyle]}>
              {translate(props.labelTranslationKey)}
            </Text>
          </Pressable>
          {props.leftSideComponent && (
            <View
              style={[
                styles.marginLeft25,
                props.additionalLeftSideComponentStyle,
              ]}>
              {props.leftSideComponent}
            </View>
          )}
        </View>
        {props.drawBottomLine && (
          <Separator
            drawLine
            height={0.5}
            additionalLineStyle={styles.bottomLine}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;

const getStyles = (
  theme: Theme,
  {width, height}: ScaledSize,
  hasLeftComponent: boolean,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingLeft: PADDING_LEFT_MAIN_MENU,
      alignItems: 'center',
      height: 41,
      width: hasLeftComponent ? '95%' : '100%',
      marginVertical: 12,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 45,
      height: 41,
      borderWidth: 1,
      borderRadius: 100,
      borderColor: getColors(theme).cardBorderColorContrast,
    },
    drawerItem: {flex: 1},
    labelStyle: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 15),
      marginLeft: 11,
    },
    bottomLine: {
      position: 'absolute',
      width: '97%',
      bottom: -22,
      top: undefined,
      borderColor: getColors(theme).lineSeparatorStroke,
    },
    rowSpaceBetween: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    marginLeft25: {
      marginLeft: 25,
    },
    flexShrinkHeightFixed: {
      width: '100%',
      height: 41,
      alignContent: 'center',
      justifyContent: 'center',
      flexShrink: 1,
    },
    flexRowStart: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    flexBetween: {justifyContent: 'space-between', width: '100%'},
  });
