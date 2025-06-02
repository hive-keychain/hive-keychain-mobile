import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {BackHandler, StyleSheet} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomNavigationComponent} from 'screens/hive/wallet/BottomNavigation.component';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';

type Props = {
  canGoBack: boolean;
  goBack: () => void;
  canGoForward: boolean;
  goForward: () => void;
  reload: () => void;
  clearCache: () => void;
  manageTabs: () => void;
  height: number;
  addTab: () => void;
  tabs: number;
  theme: Theme;
  desktopMode: boolean;
  toggleDesktopMode: () => void;
};
const BrowserBottomBar = ({
  canGoBack,
  goBack,
  addTab,
  manageTabs,
  height,
  tabs,
  theme,
  desktopMode,
  toggleDesktopMode,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(height, insets, theme);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (canGoBack) goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [canGoBack]),
  );

  return (
    <BottomNavigationComponent
    // activeScreen={BottomBarLink.Browser}
    // additionalLinks={[
    //   <Pressable
    //     onPress={addTab}
    //     style={({pressed}) => {
    //       return [styles.pressable, pressed && styles.pressed];
    //     }}>
    //     <Icon
    //       theme={theme}
    //       name={Icons.ADD_BROWSER}
    //       additionalContainerStyle={[styles.circleContainer]}
    //       {...styles.icon}
    //       color={'white'}
    //     />
    //   </Pressable>,
    //   <Pressable
    //     onPress={manageTabs}
    //     style={({pressed}) => {
    //       return [styles.pressable, pressed && styles.pressed];
    //     }}>
    //     <View style={styles.manage}>
    //       <Text style={[styles.textBase, styles.redColor]}>{tabs}</Text>
    //     </View>
    //   </Pressable>,
    //   <Pressable
    //     onPress={toggleDesktopMode}
    //     style={({pressed}) => {
    //       return [styles.pressable, pressed && styles.pressed];
    //     }}>
    //     <Icon
    //       theme={theme}
    //       name={desktopMode ? Icons.MOBILE : Icons.DESKTOP}
    //       width={26}
    //       height={26}
    //       color={'white'}
    //     />
    //   </Pressable>,
    // ]}
    />
  );
};

const getStyles = (height: number, insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    icon: {width: 22, height: 22},
    footer: {
      height: height || 40,
      marginBottom: -insets.bottom - 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    manage: {
      borderColor: 'white',
      borderWidth: 1,
      width: 22,
      height: 22,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleContainer: {
      borderRadius: 50,
      width: 22,
      height: 22,
      borderColor: 'white',
      borderWidth: 1,
    },
    textBase: {
      ...body_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    redColor: {
      color: 'white',
    },
    pressable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      paddingBottom: insets.bottom / 2,
      marginTop: 5,
    },
    pressed: {
      backgroundColor: getColors(theme).pressedButton,
    },
    wallet: {
      flex: 1.5,
      backgroundColor: getColors(theme).borderContrast,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    walletLeft: {
      flex: 1.2,
    },
    browser: {
      flex: 1.2,
      backgroundColor: PRIMARY_RED_COLOR,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  });

export const BrowserBottomBarComponent = BrowserBottomBar;
