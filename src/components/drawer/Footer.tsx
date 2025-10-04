import {loadAccount} from 'actions/hive';
import {ActiveAccount, KeyTypes} from 'actions/interfaces';
import DiscordLogo from 'assets/images/drawer/discord_logo.svg';
import HiveLogo from 'assets/images/hive/hive_logo.svg';
import MediumLogo from 'assets/images/drawer/medium.svg';
import XLogo from 'assets/images/drawer/x_logo.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  Pressable,
  ScaledSize,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-root-toast';
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
import {voteForWitness} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';

export default ({
  user,
  theme,
  addTab,
}: {
  user: ActiveAccount;
  theme: Theme;
  addTab: (url: string) => void;
}) => {
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
    const account = 'stoodkev';
    return (
      <EllipticButton
        title={translate('drawerFooter.vote', {account})}
        style={[styles.warningProceedButton]}
        additionalTextStyle={styles.buttonText}
        isWarningButton
        onPress={async () => {
          try {
            if (!user.keys[KeyTypes.active]) {
              Toast.show(translate('drawerFooter.errorActive'), {
                duration: Toast.durations.LONG,
              });
              return;
            }
            if (user.account.witness_votes.length === 30) {
              Toast.show(translate('drawerFooter.error30'), {
                duration: Toast.durations.LONG,
              });
              return;
            }
            await voteForWitness(user.keys[KeyTypes.active], {
              account: user.name,
              witness: account,
              approve: true,
            });
            Toast.show(translate('drawerFooter.thanks'), {
              duration: Toast.durations.LONG,
            });
            //@ts-ignore
            store.dispatch(loadAccount(user.name));
          } catch (e) {
            Toast.show(translate('drawerFooter.error') + JSON.stringify(e), {
              duration: Toast.durations.LONG,
            });
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
        <Pressable
          onPress={() => {
            addTab(`https://peakd.com/@keychain`);
            navigate('Browser');
          }}
          style={({pressed}) => [
            styles.footerIconContainer,
            {backgroundColor: pressed ? PRIMARY_RED_COLOR : 'transparent'},
          ]}>
          <HiveLogo
            fill={theme === Theme.DARK ? 'white' : '#484848'}
            style={styles.footerLogo}
          />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`https://discord.gg/tUHtyev2xF`)}
          style={({pressed}) => [
            styles.footerIconContainer,
            {backgroundColor: pressed ? PRIMARY_RED_COLOR : 'transparent'},
          ]}>
          <DiscordLogo
            style={styles.footerLogo}
            fill={theme === Theme.DARK ? 'white' : '#484848'}
          />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`https://x.com/HiveKeychain`)}
          style={({pressed}) => [
            styles.footerIconContainer,
            {backgroundColor: pressed ? PRIMARY_RED_COLOR : 'transparent'},
          ]}>
          <XLogo
            width={20}
            height={20}
            fill={theme === Theme.DARK ? 'white' : '#484848'}
            style={styles.footerLogo}
          />
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL(`https://medium.com/@hivekeychain`)}
          style={({pressed}) => [
            styles.footerIconContainer,
            {backgroundColor: pressed ? PRIMARY_RED_COLOR : 'transparent'},
          ]}>
          <MediumLogo
            fill={theme === Theme.DARK ? 'white' : '#484848'}
            style={styles.footerLogo}
          />
        </Pressable>
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
      width: '90%',
      justifyContent: 'space-evenly',
      marginTop: 32,
    },
    footerLogo: {
      bottom: 4,
      width: 20,
      height: 20,
    },
  });
