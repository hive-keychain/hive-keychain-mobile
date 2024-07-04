import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'components/carousel/carousel';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  body_primary_body_3,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {VersionLogUtils} from 'utils/version-log.utils';
import {WhatsNewUtils} from 'utils/whats-new.utils';
import {Feature, WhatsNewContent} from './whats-new.interface';

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
  const [index, setIndex] = useState(0);
  const locale = 'en'; // later use getUILanguage()
  const {theme} = useThemeContext();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const lastVersionStorage = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
    );
    const lastVersionAPI = await VersionLogUtils.getLastVersion();
    const mobileAppVersion = VersionLogUtils.getCurrentMobileAppVersion()
      .version.split('.')
      .splice(0, 2)
      .join('.');
    if (!lastVersionStorage) {
      WhatsNewUtils.saveLastSeen();
    } else if (
      mobileAppVersion !== lastVersionStorage &&
      lastVersionAPI.version === mobileAppVersion
    ) {
      setWhatsNewContent(lastVersionAPI);
    }
  };

  useEffect(() => {
    (async () => {
      if (whatsNewContent) {
        for (const feature of whatsNewContent.features[locale]) {
          await prefetchImage(feature.image);
        }
        navigate('ModalScreen', {
          name: 'WhatsNewPopup',
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

  const handleOnClickItem = (content: WhatsNewContent, feature: Feature) => {
    if (feature.externalUrl) {
      Linking.openURL(feature.externalUrl);
    } else {
      Linking.openURL(`${content.url}#${feature.anchor}`);
    }
  };

  const renderItem = (feature: Feature) => {
    return (
      <View key={`carousel-item-${feature.title}`} style={styles.itemContainer}>
        <Image
          style={styles.image}
          source={{uri: feature.image}}
          resizeMode={'contain'}
        />
        <Text style={styles.titleText}>{feature.title}</Text>
        <Text style={styles.descriptionText}>{feature.description}</Text>
        <Text
          style={styles.readMoreText}
          onPress={() => handleOnClickItem(whatsNewContent, feature)}>
          {feature.overrideReadMoreLabel ?? translate('common.popup_read_more')}
        </Text>
      </View>
    );
  };

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
          carouselContent={whatsNewContent.features[locale]}
          renderItem={renderItem}
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
    itemContainer: {
      alignItems: 'center',
      flexDirection: 'column',
    },
    titleText: {
      marginBottom: 8,
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: 14,
    },
    descriptionText: {
      ...body_primary_body_3,
      color: getColors(theme).secondaryText,
      fontSize: 13,
      marginBottom: 8,
      textAlign: 'center',
    },
    readMoreText: {
      textDecorationLine: 'underline',
      ...body_primary_body_3,
      color: PRIMARY_RED_COLOR,
      fontSize: 15,
      marginBottom: 8,
    },
  });

export default WhatsNew;
