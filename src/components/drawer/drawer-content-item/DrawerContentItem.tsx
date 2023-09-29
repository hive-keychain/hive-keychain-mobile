import {DrawerContentComponentProps} from '@react-navigation/drawer';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  View,
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
  useTouchableOpacity?: boolean;
  drawBottomLine?: boolean;
}

type Props = PropsDrawerContentItem & DrawerContentComponentProps;

const DrawerContentItem = (props: Props) => {
  const dimensions = useWindowDimensions();
  const {height} = dimensions;
  const styles = getStyles(props.theme, dimensions);

  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.iconContainer}>{props.iconImage}</View>
        <View style={styles.rowSpaceBetween}>
          <TouchableOpacity onPress={() => props.onPress()}>
            <Text style={[styles.labelStyle]}>
              {translate(props.labelTranslationKey)}
            </Text>
          </TouchableOpacity>
          {props.leftSideComponent}
        </View>
      </View>
      {props.drawBottomLine && (
        <Separator
          drawLine
          height={0.5}
          additionalLineStyle={styles.bottomLine}
        />
      )}
    </>
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
      borderColor: getColors(theme).cardBorderColorContrast,
      left: 51,
    },
    rowSpaceBetween: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
  });
