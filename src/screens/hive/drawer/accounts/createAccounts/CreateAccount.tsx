import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import CloseButton from 'components/ui/CloseButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Text} from 'react-native-elements';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonHeight} from 'src/styles/button';
import {NEUTRAL_WHITE_COLOR, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
  title_secondary_title_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {hiveConfig} from 'utils/config.utils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation.utils';
import {PlatformsUtils} from 'utils/platforms.utils';

const CreateAccount = ({showExternalOnboarding}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getStyles(width, insets);
  return (
    <Background theme={theme} containerStyle={styles.container} skipTop>
      <View style={styles.pageContainer}>
        <FocusAwareStatusBar />
        <View style={styles.captionContainer}>
          <Caption text={'createAccount.caption'} />
        </View>
        <View style={[styles.buttonsContainer]}>
          {PlatformsUtils.showDependingOnPlatform(
            <EllipticButton
              title={translate('createAccount.on_boarding_title')}
              onPress={() => {
                if (Platform.OS === 'android')
                  Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
                else
                  navigate('ModalScreen', {
                    name: `CreateAccountOnHiveio`,
                    modalContent: (
                      <>
                        <View style={styles.webviewContainer}>
                          <Text style={title_secondary_title_2}>Hive.io</Text>
                          <CloseButton
                            theme={Theme.LIGHT}
                            onPress={() => {
                              goBack();
                            }}
                            additionalContainerStyle={{paddingTop: 5}}
                          />
                        </View>
                        <WebView
                          source={{uri: hiveConfig.CREATE_ACCOUNT_URL}}
                        />
                      </>
                    ),
                    bottomHalf: false,
                    additionalWrapperFixedStyle: {maxHeight: '100%'},
                  });
              }}
              style={styles.outlineButton}
              additionalTextStyle={styles.textOutLineButton}
            />,
            showExternalOnboarding,
          )}
          <Separator height={height * 0.015} />
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

const getStyles = (width: number, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
    },
    pageContainer: {
      display: 'flex',
      flex: 1,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      height: getButtonHeight(width),
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 13),
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
    outlineButton: {
      backgroundColor: '#FFFFFF',
      zIndex: 10,
      height: getButtonHeight(width),
    },
    textOutLineButton: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 13),
      color: '#212838',
    },
    webviewContainer: {
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingHorizontal: 20,
    },
  });

const connector = connect((state: RootState) => {
  return {
    showExternalOnboarding:
      state.settings.mobileSettings?.platformRelevantFeatures
        ?.externalOnboarding,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccount);
