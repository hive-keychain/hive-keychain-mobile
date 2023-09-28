import {
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface PropsDrawerContentItem {
  labelTranslationKey: string;
  theme: Theme;
  onPress: () => void;
  iconImage: JSX.Element;
  leftSideComponent?: JSX.Element;
  useTouchableOpacity?: boolean;
  lineSvgBottomDark?: JSX.Element;
  lineSvgBottomLight?: JSX.Element;
}

type Props = PropsDrawerContentItem & DrawerContentComponentProps;

const DrawerContentItem = (props: Props) => {
  //TODO optionally render using TO.

  const styles = getStyles(props.theme);

  return (
    <>
      <View style={[styles.container]}>
        <View style={styles.iconContainer}>
          {props.iconImage}
          {/* <AccountsMenuIcon /> */}
        </View>
        <DrawerItem
          {...props}
          label={translate(props.labelTranslationKey)}
          onPress={() => props.onPress()}
          style={styles.drawerItem}
          labelStyle={styles.labelStyle}
          //   focused={newState.index === 0 && !isAccountMenuExpanded}
        />
        {props.leftSideComponent}
      </View>
      {props.theme === Theme.LIGHT
        ? props.lineSvgBottomLight
        : props.lineSvgBottomDark}
    </>
  );
};

export default DrawerContentItem;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flexDirection: 'row', paddingLeft: 10, alignItems: 'center'},
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
      fontSize: 15,
    },
  });
