import AsyncStorage from '@react-native-async-storage/async-storage';
import {addTab} from 'actions/browser';
import TUTORIAL_POPUP_IMAGE from 'assets/new_UI/onboarding_mobile.png';
import EllipticButton from 'components/form/EllipticButton';
import {Image} from 'expo-image';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';

import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  body_primary_body_1,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {tutorialBaseUrl} from 'utils/config';
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
  const init = async () => {
    const skipTutorial = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.SKIP_TUTORIAL,
    );
    if (!skipTutorial) {
      setTimeout(() => {
        setShow(true);
      }, 3000);
    }
  };

  useEffect(() => {
    if (show) {
      navigate('ModalScreen', {
        name: 'TutorialPopup',
        modalContent: renderContent(),
        onForceCloseModal: () => {},
        modalContainerStyle: getModalBaseStyle(theme).roundedTop,
      } as ModalScreenProps);
    }
  }, [show]);

  const handleClick = async (option: 'skip' | 'show') => {
    const hidePopup = async () => {
      await AsyncStorage.setItem(KeychainStorageKeyEnum.SKIP_TUTORIAL, 'true');
      setShow(false);
    };

    if (option === 'show') {
      addTab(tutorialBaseUrl + '/#/mobile');
      await hidePopup();
      return navigation.navigate('Browser');
    }
    await hidePopup();
    navigation.goBack();
  };

  const styles = getStyles(theme, useWindowDimensions());

  const renderContent = () => {
    return (
      <View aria-label="whats-new-component" style={styles.rootContainer}>
        <Text style={[styles.baseText, styles.title]}>
          {translate('popup.tutorial.title')}
        </Text>
        <Image source={TUTORIAL_POPUP_IMAGE} style={styles.image} />
        <Text style={[styles.baseText, styles.description]}>
          {translate('popup.tutorial.description')}
        </Text>
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('common.skip')}
            onPress={() => handleClick('skip')}
            style={[styles.outlineButton]}
            additionalTextStyle={styles.textButtonFilledSkip}
          />
          <EllipticButton
            title={translate('common.show')}
            onPress={() => handleClick('show')}
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

const getStyles = (theme: Theme, screenDimensions: Dimensions) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: screenDimensions.height * 0.8,
    },
    baseText: {
      color: getColors(theme).secondaryText,
    },
    title: {
      textAlign: 'center',
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(screenDimensions.width, 18),
    },
    description: {
      ...body_primary_body_1,
      fontSize: getFontSizeSmallDevices(
        screenDimensions.width,
        body_primary_body_1.fontSize,
      ),
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      height: 60,
    },
    image: {
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
      borderRadius: 16,
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
    textButtonFilledSkip: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: getColors(theme).primaryText,
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
