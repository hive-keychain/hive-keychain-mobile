import Carousel from 'components/carousel/carousel';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {VersionLogUtils} from 'utils/version-log.utils';
import {WhatsNewContent} from './whats-new.interface';

interface Props {
  // onOverlayClick: () => void;
  // content: WhatsNewContent;
  navigation: WalletNavigation;
}

interface ImageItems {
  source: string;
}

const WhatsNew = ({navigation}: Props): null => {
  const [pageIndex, setPageIndex] = useState(0);
  // const [content, setContent] = useState(null);
  const [whatsNewContent, setWhatsNewContent] = useState<WhatsNewContent>();
  // const [images, setImages] = useState<JSX.Element[]>();
  // const [ready, setReady] = useState(false);
  const locale = 'en'; // later use getUILanguage()

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    //by passed for now
    const lastVersionSeen = '0';
    // const lastVersionSeen = await AsyncStorage.getItem(
    //   KeychainStorageKeyEnum.LAST_VERSION_UPDATE,
    // );

    // if (!lastVersionSeen) {
    //   //TODO code WhatsNewUtils.saveLastSeen
    //   //WhatsNewUtils.saveLastSeen();
    //   return;
    // }
    //END by passed for now

    const versionLog = await VersionLogUtils.getLastVersion();
    const extensionVersion = VersionLogUtils.getCurrentMobileAppVersion()
      .version.split('.')
      .splice(0, 2)
      .join('.');
    console.log({extensionVersion, versionLog, lastVersionSeen}); //TODO to remove
    if (
      extensionVersion !== lastVersionSeen &&
      versionLog.version === extensionVersion
    ) {
      setWhatsNewContent(versionLog);
    }

    // const imgs: ImageItems[] = [];
    // for (const feature of content.features[locale]) {
    //   const imageItem: ImageItems = {
    //     source: feature.image,
    //   };
    //   imgs.push(imageItem);
    // }
    // const Images = imgs.map((img, index) => {
    //   return <Image source={{uri: img.source}} style={styles.whatsNewImage} />;
    // });
    // setImages(Images);
    // setReady(true);

    // navigate('ModalScreen', {
    //   name: 'Whats_new_popup',
    //   modalContent: renderContent(),
    //   onForceCloseModal: () => navigation.goBack(),
    // });
  };

  useEffect(() => {
    console.log({whatsNewContent}); //TODO to remove
    if (whatsNewContent) {
      navigate('ModalScreen', {
        name: 'Whats_new_popup',
        modalContent: renderContent(),
        onForceCloseModal: () => navigation.goBack(),
      });
    }
  }, [whatsNewContent]);

  // const next = () => {
  //   setPageIndex(pageIndex + 1);
  // };
  // const previous = () => {
  //   setPageIndex(pageIndex - 1);
  // };

  // const navigateToArticle = (url: string) => {
  //   //TODO implement
  //   // chrome.tabs.create({url: url});
  // };

  // const finish = async () => {
  //   //  TODO uncomment after testing all good so it will modify the
  //   //  lastSeenVersion and will not load anymore :D
  //   // await AsyncStorage.setItem(KeychainStorageKeyEnum.LAST_VERSION_UPDATE, content.version);
  //   // onOverlayClick();
  // };

  // const renderCustomIndicator = (
  //   clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void,
  //   isSelected: boolean,
  //   index: number,
  //   label: string,
  // ) => {
  //   return (
  //     <li
  //       className={`dot ${isSelected ? 'selected' : ''}`}
  //       onClick={(e) => {
  //         clickHandler(e);
  //         setPageIndex(index);
  //       }}></li>
  //   );
  // };

  const renderContent = () => {
    return (
      whatsNewContent && (
        <View aria-label="whats-new-component" style={styles.rootContainer}>
          {/* <View style={styles.whatsNewContainer}> */}
          <Text style={styles.whatsNewTitle}>
            {translate('popup.whats_new.intro', {
              content_version: whatsNewContent.version,
            })}
          </Text>
          <Carousel
            whatsNewContent={whatsNewContent}
            locale={locale}
            nextButtonConfig={{
              nextTitle: 'Next',
              lastTitle: 'Got it!',
              lastSlideAction: () => console.log('Executing last Action!'),
            }}
          />
          {/* </View> */}
        </View>
      )
    );
  };
  return null;
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  // whatsNewContainer: {
  //   flex: 1,
  // },
  whatsNewTitle: {
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  whatsNewButtonPanel: {},
  whatsNewImage: {
    // width: '60%',
    // height: '60%',
  },
});

export default WhatsNew;
