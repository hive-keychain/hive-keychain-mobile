import AsyncStorage from '@react-native-async-storage/async-storage';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import {BrowserScreenProps} from 'navigators/mainDrawerStacks/Browser.types';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation.utils';
interface Props {
  navigation: BrowserScreenProps['navigation'];
}

const BrowserTutorial = ({navigation}: Props): null => {
  const {theme} = useThemeContext();

  useEffect(() => {
    checkIfShouldNotify();
  }, []);
  const styles = getStyles(theme);
  const checkIfShouldNotify = async () => {
    const shouldNotify = !(await AsyncStorage.getItem(
      KeychainStorageKeyEnum.BROWSER_TUTORIAL_SHOWN,
    ));
    if (shouldNotify) {
      navigate('ModalScreen', {
        name: 'BrowserTutorial',
        modalContent: <SafeArea skipTop>{renderContent()}</SafeArea>,
        modalContainerStyle: getModalBaseStyle(theme).roundedTop,
        onForceCloseModal: () => {},
      });
    }
  };

  const renderContent = () => {
    return (
      <ScrollView
        aria-label="browser-tutorial-component"
        style={styles.rootContainer}>
        <Text style={styles.title}>
          {translate('popup.browser_tutorial.title')}
        </Text>
        <Separator />
        <View>
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.description')}
          </Text>
        </View>
        <Separator />
        <View style={styles.iconContainer}>
          <Icon
            name={Icons.TWO_FINGERS_TAP}
            {...styles.icon}
            color={PRIMARY_RED_COLOR}
          />
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.double_tap')}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name={Icons.SWIPE_RIGHT}
            {...styles.icon}
            color={PRIMARY_RED_COLOR}
          />
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.swipe_right')}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name={Icons.SWIPE_LEFT}
            {...styles.icon}
            color={PRIMARY_RED_COLOR}
          />
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.swipe_left')}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name={Icons.SWIPE_DOWN}
            {...styles.icon}
            color={PRIMARY_RED_COLOR}
          />
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.swipe_down')}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name={Icons.BROWSER}
            {...styles.icon}
            color={PRIMARY_RED_COLOR}
          />
          <Text style={styles.text}>
            {translate('popup.browser_tutorial.browser_button')}
          </Text>
        </View>
        <Separator />
        <EllipticButton
          title={translate('common.got_it')}
          isWarningButton
          style={styles.button}
          onPress={() => {
            AsyncStorage.setItem(
              KeychainStorageKeyEnum.BROWSER_TUTORIAL_SHOWN,
              'true',
            );
            goBack();
          }}
        />
        <Separator height={initialWindowMetrics.insets.bottom} />
      </ScrollView>
    );
  };
  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rootContainer: {
      width: '100%',
      padding: 12,
    },
    title: {
      textAlign: 'center',
      color: getColors(theme).secondaryText,
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      color: getColors(theme).secondaryText,
      flex: 1,
    },
    button: {
      width: '100%',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      columnGap: 10,
    },
    icon: {
      width: 25,
      height: 25,
    },
  });

export default BrowserTutorial;
