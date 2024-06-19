import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React from 'react';
import {Linking, StyleSheet, View, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getButtonHeight} from 'src/styles/button';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {NEUTRAL_WHITE_COLOR, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
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
        <FocusAwareStatusBar />
        <View style={styles.captionContainer}>
          <Caption text={'createAccount.caption'} />
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
      justifyContent: 'center',
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
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: 'auto',
    },
    captionContainer: {
      paddingHorizontal: 18,
      alignSelf: 'center',
      marginBottom: 24,
    },
  });

export default CreateAccount;
