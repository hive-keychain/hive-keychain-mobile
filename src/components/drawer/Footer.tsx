import {loadAccount} from 'actions/hive';
import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import DiscordLogo from 'assets/new_UI/discord_logo.svg';
import HiveLogo from 'assets/new_UI/hive_logo.svg';
import ThreadsLogo from 'assets/new_UI/threads_logo.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  ScaledSize,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {
  BACKGROUNDITEMDARKISH,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {store} from 'store';
import {voteForWitness} from 'utils/hive';
import {translate} from 'utils/localize';

export default ({user, theme}: {user: ActiveAccount; theme: Theme}) => {
  const styles = getStyles(theme, useWindowDimensions());

  const [showVoteWitnessButton, setShowVoteWitnessButton] = useState(false);

  useEffect(() => {
    if (user && user.account && user.account.witness_votes) {
      setShowVoteWitnessButton(
        user.account.proxy?.length === 0 &&
          !(
            user.account.witness_votes &&
            user.account.witness_votes.includes('stoodkev')
          ),
      );
    }
  }, [user]);

  const showVoteForWitness = () => {
    const account = user.account.witness_votes?.includes('stoodkev')
      ? 'cedricguillas'
      : 'stoodkev';
    return (
      <EllipticButton
        title={translate('drawerFooter.vote', {account})}
        style={[styles.warningProceedButton]}
        additionalTextStyle={styles.buttonText}
        isWarningButton
        onPress={async () => {
          try {
            if (!user.keys[KeyTypes.active]) {
              Toast.show(translate('drawerFooter.errorActive'), Toast.LONG);
              return;
            }
            if (user.account.witness_votes.length === 30) {
              Toast.show(translate('drawerFooter.error30'), Toast.LONG);
              return;
            }
            await voteForWitness(user.keys[KeyTypes.active], {
              account: user.name,
              witness: account,
              approve: true,
            });
            //@ts-ignore
            store.dispatch(loadAccount(user.name));
            Toast.show(translate('drawerFooter.thanks'), Toast.LONG);
          } catch (e) {
            Toast.show(
              translate('drawerFooter.error') + JSON.stringify(e),
              Toast.LONG,
            );
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.footer]}>
      {showVoteWitnessButton && (
        <View style={styles.footerVoteButtonContainer}>
          {showVoteForWitness()}
        </View>
      )}
      <View style={styles.footerIconsContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL(`https://peakd.com/@keychain`)}
          style={styles.footerIconContainer}>
          <HiveLogo style={styles.footerLogo} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL(`https://discord.gg/tUHtyev2xF`)}
          style={styles.footerIconContainer}>
          <DiscordLogo style={styles.footerLogo} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Linking.openURL(`https://twitter.com/HiveKeychain`)}
          style={styles.footerIconContainer}>
          <ThreadsLogo width={20} style={styles.footerLogo} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    footer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      top: undefined,
    },
    footerText: {
      ...button_link_primary_medium,
    },
    witness: {
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      padding: 5,
      marginTop: 10,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    footerIconContainer: {
      borderWidth: 1,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderColor: getColors(theme).cardBorderColorContrast,
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: 45,
      height: 35,
      backgroundColor: theme === Theme.DARK ? BACKGROUNDITEMDARKISH : '#FFF',
    },
    footerVoteButtonContainer: {
      width: '100%',
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerIconsContainer: {
      flexDirection: 'row',
      width: '65%',
      justifyContent: 'space-evenly',
      marginTop: 32,
    },
    footerLogo: {
      bottom: 4,
    },
  });
