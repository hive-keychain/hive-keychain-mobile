import AsyncStorage from '@react-native-async-storage/async-storage';
import {addTab} from 'actions/browser';
import EllipticButton from 'components/form/EllipticButton';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  button_link_primary_medium,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

interface Props {
  navigation: WalletNavigation;
}

const Tutorial = ({navigation, addTab}: Props & PropsFromRedux): null => {
  const [show, setShow] = useState(false);
  const {theme} = useThemeContext();

  useEffect(() => {
    init();
  }, []);

  const init = async (clearWhileTesting?: boolean) => {
    //TODO bellow remove clear
    if (clearWhileTesting) {
      await AsyncStorage.setItem(KeychainStorageKeyEnum.SKIP_TUTORIAL, null);
      return;
    }
    const skipTutorial = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.SKIP_TUTORIAL,
    );
    if (!skipTutorial) {
      setShow(true);
    }
  };

  useEffect(() => {
    if (show) {
      navigate('ModalScreen', {
        name: 'TutorialPopup',
        modalContent: renderContent(),
        onForceCloseModal: () => {},
        modalContainerStyle: getModalBaseStyle(theme).roundedTop,
        fixedHeight: 0.3,
      } as ModalScreenProps);
    }
  }, [show]);

  const handleClick = async (
    option: 'tutorial_seen' | 'tutorial_opted_out',
  ) => {
    const hidePopup = async (
      option: 'tutorial_seen' | 'tutorial_opted_out',
    ) => {
      await AsyncStorage.setItem(KeychainStorageKeyEnum.SKIP_TUTORIAL, option);
      setShow(false);
    };

    if (option === 'tutorial_seen') {
      addTab(`http://192.168.56.1:3000/mobile`);
      await hidePopup(option);
      return navigation.navigate('BrowserScreen');
    }
    await hidePopup(option);
    navigation.goBack();
  };

  const styles = getStyles(theme);

  const renderContent = () => {
    return (
      <View aria-label="whats-new-component" style={styles.rootContainer}>
        <Text style={styles.intro}>{translate('popup.tutorial.intro')}</Text>
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('common.no')}
            onPress={() => handleClick('tutorial_opted_out')}
            style={[styles.outlineButton]}
            additionalTextStyle={styles.textButtonFilled}
          />
          <EllipticButton
            title={translate('common.yes')}
            onPress={() => handleClick('tutorial_seen')}
            style={[
              styles.warningProceedButton,
              generateBoxShadowStyle(
                0,
                13,
                RED_SHADOW_COLOR,
                1,
                25,
                30,
                RED_SHADOW_COLOR,
              ),
            ]}
            additionalTextStyle={styles.textButtonFilled}
          />
        </View>
      </View>
    );
  };
  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      marginTop: 15,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    intro: {
      textAlign: 'center',
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: 18,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: 100,
      marginBottom: 20,
    },
    image: {
      marginBottom: 30,
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '40%',
    },
    outlineButton: {
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
      width: '40%',
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {};
  },
  {addTab},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const TutorialPopup = connector(Tutorial);
