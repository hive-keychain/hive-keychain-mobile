import {signBuffer} from 'components/bridge';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, TextStyle, View} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {MultisigModule} from 'src/background/multisig.module';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {MultisigAccountConfig} from 'src/interfaces/multisig.interface';
import {CARD_PADDING_HORIZONTAL} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {title_primary_title_1} from 'src/styles/typography';
import {RootState} from 'store';
import {MultisigUtils} from 'utils/multisig.utils';

const defaultConfig: MultisigAccountConfig = {
  isEnabled: false,
  active: {isEnabled: false, publicKey: '', message: ''},
  posting: {isEnabled: false, publicKey: '', message: ''},
};

const Multisig = ({active}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  const [multisigAccountConfig, setMultisigAccountConfig] = useState<
    MultisigAccountConfig
  >(defaultConfig);

  useEffect(() => {
    init();
  }, [active]);

  const init = async () => {
    const multisigAccountConfig = await MultisigUtils.getMultisigAccountConfig(
      active.name!,
    );
    setMultisigAccountConfig(multisigAccountConfig ?? defaultConfig);
  };

  const saveMultisigEnabled = async (isEnabled: boolean) => {
    //TODO possible code block bellow not needed
    // if (!MultisigUtils.isMultisigCompatible()) {
    //   setErrorMessage('min_chrome_version');
    //   return;
    // }
    const newConfig = {
      ...multisigAccountConfig,
      isEnabled: isEnabled,
      active: {
        ...multisigAccountConfig.active,
        isEnabled: false,
      },
      posting: {
        ...multisigAccountConfig.posting,
        isEnabled: false,
      },
    };
    setMultisigAccountConfig(newConfig);
    await MultisigUtils.saveMultisigConfig(active.name!, newConfig);
    console.log('saveMultisigEnabled', {isEnabled});
    if (!isEnabled) {
      MultisigModule.refreshConnections({
        account: active.name!,
        connect: isEnabled,
      });
    }
  };

  const saveMultisigEnabledActive = async (isEnabled: boolean) => {
    let message: string = '';
    let publicKey: string = '';

    if (isEnabled) {
      message = await signBuffer(active.keys.active!, active.name!);
      publicKey = active?.keys.activePubkey!;
    }

    const newConfig: MultisigAccountConfig = {
      ...multisigAccountConfig!,
      active: {isEnabled: isEnabled, message: message, publicKey: publicKey},
    };
    console.log({newConfig}); //TODO remove line

    setMultisigAccountConfig(newConfig);
    await MultisigUtils.saveMultisigConfig(active.name!, newConfig);
    MultisigModule.refreshConnections({
      account: active.name!,
      connect: isEnabled,
      publicKey: multisigAccountConfig.active.publicKey,
      message: multisigAccountConfig.active.message,
    });
  };

  const saveMultisigEnabledPosting = async (isEnabled: boolean) => {
    let message: string = '';
    let publicKey: string = '';

    if (isEnabled) {
      message = await signBuffer(active.keys.posting!, active.name!);
      publicKey = active.keys.postingPubkey!;
    }

    const newConfig: MultisigAccountConfig = {
      ...multisigAccountConfig!,
      posting: {isEnabled: isEnabled, message: message, publicKey: publicKey},
    };
    setMultisigAccountConfig(newConfig);
    await MultisigUtils.saveMultisigConfig(active.name!, newConfig);
    MultisigModule.refreshConnections({
      account: active.name!,
      connect: isEnabled,
      publicKey: multisigAccountConfig.posting.publicKey,
      message: multisigAccountConfig.posting.message,
    });
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{
        paddingBottom: initialWindowMetrics.insets.bottom,
      }}>
      <View style={styles.container}>
        <Caption
          text={'settings.settings.multisig.multisig_intro'}
          additionnalText="settings.settings.multisig.more_info_blog"
          additionnalTextOnClick={() =>
            Linking.openURL(
              'https://peakd.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain',
            )
          }
          additionnalTextStyle={{textDecorationLine: 'underline'} as TextStyle}
          hideSeparator
          separatorHeight={10}
        />
        <Caption
          skipFirstTextLine
          text="not_used"
          additionnalText="settings.settings.multisig.more_info_multisig"
          additionnalTextOnClick={() =>
            Linking.openURL('https://multisig.hive-keychain.com/')
          }
          additionnalTextStyle={{textDecorationLine: 'underline'} as TextStyle}
          hideSeparator
        />
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator />
        <CheckBoxPanel
          checked={multisigAccountConfig.isEnabled}
          onPress={() => saveMultisigEnabled(!multisigAccountConfig.isEnabled)}
          containerStyle={{flexGrow: undefined}}
          title="settings.settings.multisig.enable_multisig"
        />
        {multisigAccountConfig.isEnabled && (
          <>
            {active.keys.active && (
              <CheckBoxPanel
                checked={multisigAccountConfig.active.isEnabled}
                onPress={() =>
                  saveMultisigEnabledActive(
                    !multisigAccountConfig.active.isEnabled,
                  )
                }
                containerStyle={{flexGrow: undefined}}
                title="settings.settings.multisig.enable_active_key_multisig"
              />
            )}
            {active.keys.posting && (
              <CheckBoxPanel
                checked={multisigAccountConfig.posting.isEnabled}
                onPress={() =>
                  saveMultisigEnabledPosting(
                    !multisigAccountConfig.posting.isEnabled,
                  )
                }
                containerStyle={{flexGrow: undefined}}
                title="settings.settings.multisig.enable_posting_key_multisig"
              />
            )}
          </>
        )}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {flex: 1, padding: CARD_PADDING_HORIZONTAL},
    title: {
      ...title_primary_title_1,
      color: getColors(theme).primaryText,
    },
  });

const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Multisig);
