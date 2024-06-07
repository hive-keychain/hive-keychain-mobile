import HandImage from 'assets/new_UI/hand_1.svg';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import KeychainLogo from 'components/ui/KeychainLogo';
import Separator from 'components/ui/Separator';
import React from 'react';
import {Linking, StyleSheet, View, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getButtonHeight} from 'src/styles/button';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {NEUTRAL_WHITE_COLOR, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
} from 'src/styles/typography';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const CreateAccount = () => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();

  const styles = getStyles(width);
  return (
    <Background theme={theme} containerStyle={styles.container}>
      <View style={styles.pageContainer}>
        <View style={styles.imgContainer}>
          <View style={[styles.keychainLogoContainer]}>
            <KeychainLogo
              theme={theme}
              using_new_ui
              width={styles.imageHive.width}
            />
          </View>
          <HandImage {...styles.imageHive} />
        </View>
        <View style={[styles.buttonsContainer]}>
          <EllipticButton
            title={translate('createAccount.on_boarding_title')}
            onPress={() => {
              Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
            }}
            style={styles.warningProceedButton}
            additionalTextStyle={styles.textButtonFilled}
          />
          <Separator height={height * 0.04} />
          <EllipticButton
            title={translate('createAccount.peer_to_peer_on_boarding_title')}
            onPress={() => {
              navigate('CreateAccountPeerToPeerScreen');
            }}
            style={styles.warningProceedButton}
            additionalTextStyle={styles.textButtonFilled}
          />
        </View>
      </View>
    </Background>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageContainer: {
      display: 'flex',
      flex: 1,
      padding: CARD_PADDING_HORIZONTAL,
      justifyContent: 'space-around',
    },
    imageHive: {
      width: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
      height: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      height: getButtonHeight(width),
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
    imgContainer: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: 'auto',
    },
    keychainLogoContainer: {
      display: 'flex',
      width: 'auto',
      justifyContent: 'center',
      alignSelf: 'center',
    },
  });

export default CreateAccount;
