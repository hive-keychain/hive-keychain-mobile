import {useFocusEffect} from '@react-navigation/native';
import Icon from 'components/hive/Icon';
import React from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {resetStackAndNavigate} from 'utils/navigation';

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
};
const Footer = ({
  canGoBack,
  goBack,
  canGoForward,
  goForward,
  reload,
  addTab,
  manageTabs,
  height,
  tabs,
  clearCache,
  theme,
}: Props & PropsFromRedux) => {
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
    <View style={styles.footer}>
      <Icon
        theme={theme}
        name={Icons.ARROW_LEFT_BROWSER}
        {...styles.iconSlightlyBigger}
        color={
          canGoBack
            ? PRIMARY_RED_COLOR
            : theme === Theme.LIGHT
            ? '#939292b3'
            : '#93929263'
        }
        onPress={goBack}
      />
      <Icon
        theme={theme}
        name={Icons.ARROW_RIGHT_BROWSER}
        {...styles.iconSlightlyBigger}
        color={
          canGoForward
            ? PRIMARY_RED_COLOR
            : theme === Theme.LIGHT
            ? '#939292b3'
            : '#93929263'
        }
        onPress={goForward}
      />
      <Icon
        theme={theme}
        name={Icons.ADD_BROWSER}
        additionalContainerStyle={[styles.circleContainer]}
        onPress={addTab}
        {...styles.icon}
        color={PRIMARY_RED_COLOR}
      />
      <Icon
        theme={theme}
        name={Icons.ROTATE_RIGHT_BROWSER}
        onPress={reload}
        onLongPress={() => {
          clearCache();
          SimpleToast.show('Cache cleared');
          reload();
        }}
        {...styles.icon}
        color={PRIMARY_RED_COLOR}
      />
      <TouchableOpacity activeOpacity={1} onPress={manageTabs}>
        <View style={styles.manage}>
          <Text style={[styles.textBase, styles.redColor]}>{tabs}</Text>
        </View>
      </TouchableOpacity>
      <Icon
        theme={theme}
        name={Icons.WALLET_ADD}
        {...styles.icon}
        onPress={() => resetStackAndNavigate('WALLET')}
        color={PRIMARY_RED_COLOR}
      />
    </View>
  );
};

const getStyles = (height: number, insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    icon: {width: 22, height: 22},
    iconSlightlyBigger: {
      width: 24,
      height: 24,
    },
    footer: {
      height: height || 40,
      marginBottom: -insets.bottom,
      paddingBottom: insets.bottom,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    manage: {
      borderColor: PRIMARY_RED_COLOR,
      borderWidth: 1,
      width: 22,
      height: 22,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleContainer: {
      borderRadius: 50,
      borderColor: PRIMARY_RED_COLOR,
      borderWidth: 1,
    },
    textBase: {
      ...body_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Footer);
