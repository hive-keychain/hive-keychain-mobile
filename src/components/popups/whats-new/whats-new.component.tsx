import AsyncStorage from '@react-native-community/async-storage';
import Carousel from 'components/carousel/carousel';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {VersionLogUtils} from 'utils/version-log.utils';
import {WhatsNewUtils} from 'utils/whats-new.utils';
import {WhatsNewContent} from './whats-new.interface';

interface Props {
  navigation: WalletNavigation;
}

interface PrefetchImageProps {
  [key: string]: any;
}

let prefetchedImages: PrefetchImageProps = {};

export function prefetchImage(url: string) {
  return Image.prefetch(url).then((val) => {
    prefetchedImages[url] = true;
    return val;
  });
}

export function isPrefetched(url: string) {
  return prefetchedImages[url] !== undefined;
}
const WhatsNew = ({navigation}: Props): null => {
  const [whatsNewContent, setWhatsNewContent] = useState<WhatsNewContent>();
  const locale = 'en'; // later use getUILanguage()
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const lastVersionSeen = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
    );
    const versionLog = await VersionLogUtils.getLastVersion();
    const extensionVersion = VersionLogUtils.getCurrentMobileAppVersion()
      .version.split('.')
      .splice(0, 2)
      .join('.');
    if (!lastVersionSeen) {
      WhatsNewUtils.saveLastSeen();
    } else if (
      extensionVersion !== lastVersionSeen &&
      versionLog.version === extensionVersion
    ) {
      setWhatsNewContent(versionLog);
    }
  };

  useEffect(() => {
    (async () => {
      if (whatsNewContent) {
        for (const feature of whatsNewContent.features[locale]) {
          await prefetchImage(feature.image);
        }
        navigate('ModalScreen', {
          name: 'Whats_new_popup',
          modalContent: renderContent(),
          onForceCloseModal: () => {},
          modalContainerStyle: getModalBaseStyle(theme).roundedTop,
        } as ModalScreenProps);
      }
    })();
  }, [whatsNewContent]);

  const finish = async () => {
    await WhatsNewUtils.saveLastSeen();
    navigation.goBack();
  };

  const styles = getStyles(theme);

  const renderContent = () => {
    return (
      <View aria-label="whats-new-component" style={styles.rootContainer}>
        <Text style={styles.whatsNewTitle}>
          {translate('popup.whats_new.intro', {
            content_version: whatsNewContent.version,
          })}
        </Text>
        <Carousel
          buttonsConfig={{
            prevTitle: translate('popup.whats_new.previous'),
            nextTitle: translate('popup.whats_new.next'),
            lastTitle: translate('popup.whats_new.got_it'),
            lastSlideAction: finish,
          }}
          content={whatsNewContent}
          locale={locale}
          theme={theme}
        />
      </View>
    );
  };
  return null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    rootContainer: {flex: 1, marginTop: 15},
    whatsNewTitle: {
      textAlign: 'center',
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: 18,
    },
    image: {
      marginBottom: 30,
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
    },
  });

export default WhatsNew;
