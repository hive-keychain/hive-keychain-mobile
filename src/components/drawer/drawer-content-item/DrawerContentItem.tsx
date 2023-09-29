import Separator from 'components/ui/Separator';
import React from 'react';
import {
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {PADDINGLEFTMAINMENU} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface PropsDrawerContentItem {
  labelTranslationKey: string;
  theme: Theme;
  onPress: () => void;
  iconImage: JSX.Element;
  leftSideComponent?: JSX.Element;
  drawBottomLine?: boolean;
  additionalContainerStyle?: StyleProp<ViewProps>;
}

type Props = PropsDrawerContentItem;

const DrawerContentItem = (props: Props) => {
  const dimensions = useWindowDimensions();
  const {height} = dimensions;
  const styles = getStyles(props.theme, dimensions);

  return (
    <View style={[styles.container, props.additionalContainerStyle]}>
      <View style={styles.iconContainer}>{props.iconImage}</View>
      <View
        //TODO here pass all styles bellow!!!
        style={[
          {
            width: '100%',
            height: height * 0.09,
            alignContent: 'center',
            justifyContent: 'center',
            flexShrink: 1,
          },
        ]}>
        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
          <TouchableOpacity onPress={() => props.onPress()}>
            <Text style={[styles.labelStyle]}>
              {translate(props.labelTranslationKey)}
            </Text>
          </TouchableOpacity>
          {props.leftSideComponent && (
            <View
              style={[
                {
                  justifyContent: 'flex-end',
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexGrow: 1,
                  flex: 1,
                },
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
    </View>
  );
};

export default DrawerContentItem;

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingLeft: PADDINGLEFTMAINMENU,
      alignItems: 'center',
      height: height * 0.09,
      width: '100%',
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
      fontSize: getFontSizeSmallDevices(height, 15),
      marginLeft: 11,
    },
    bottomLine: {
      position: 'absolute',
      width: '97%',
      bottom: -8,
      borderColor: getColors(theme).lineSeparatorStroke,
    },
    rowSpaceBetween: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
  });
