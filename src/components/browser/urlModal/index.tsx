import Clipboard from '@react-native-community/clipboard';
import {ActionPayload, BrowserPayload, Page} from 'actions/interfaces';
import Copy from 'assets/browser/copy.svg';
import ShareIcon from 'assets/browser/share.svg';
import React, {MutableRefObject, useRef} from 'react';
import {
  NativeSyntheticEvent,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {translate} from 'utils/localize';
import UrlAutocomplete from './UrlAutocomplete';

const SLIDE_TIME = 500;

type Props = {
  isVisible: boolean;
  toggle: (b: boolean) => void;
  onNewSearch: (string: string) => void;
  url: string;
  setUrl: (string: string) => void;
  history: Page[];
  clearHistory: () => ActionPayload<BrowserPayload>;
};
const UrlModal = ({
  isVisible,
  toggle,
  onNewSearch,
  url,
  setUrl,
  history,
  clearHistory,
}: Props) => {
  const urlInput: MutableRefObject<TextInput> = useRef();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  if (isVisible && urlInput) {
    setTimeout(() => {
      const {current} = urlInput;
      if (current && !current.isFocused()) {
        current.focus();
      }
    }, SLIDE_TIME);
  }

  const onSubmitUrlFromInput = (
    obj: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    const url = obj.nativeEvent.text;
    onSubmitUrl(url);
  };

  const onSubmitUrl = (url: string) => {
    toggle(false);
    // Add duckduck go search for url with no domain
    if (url.includes(' ') || !url.includes('.')) {
      onNewSearch(`https://duckduckgo.com/?q=${url.replace(/ /g, '+')}`);
    } else {
      const hasProtocol = url.match(/^[a-z]*:\/\//);
      const sanitizedURL = hasProtocol ? url : `https://${url}`;
      onNewSearch(sanitizedURL);
    }
  };

  const dismissModal = () => {
    toggle(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      style={styles.urlModal}
      onBackdropPress={dismissModal}
      onBackButtonPress={dismissModal}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      backdropOpacity={0.8}
      animationInTiming={SLIDE_TIME}
      animationOutTiming={SLIDE_TIME}
      useNativeDriver>
      <View style={styles.urlModalContent}>
        <TextInput
          keyboardType="web-search"
          ref={urlInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          onChangeText={setUrl}
          onSubmitEditing={onSubmitUrlFromInput}
          placeholder={translate('browser.search')}
          returnKeyType="go"
          style={styles.urlInput}
          value={url}
          selectTextOnFocus
        />
        {url.length ? (
          <TouchableOpacity
            style={styles.option}
            onPress={() => Share.share({message: url})}>
            <ShareIcon width={16} height={16} />
          </TouchableOpacity>
        ) : null}
        {url.length ? (
          <TouchableOpacity
            style={styles.option}
            onPress={() => Clipboard.setString(url)}>
            <Copy width={16} height={16} />
          </TouchableOpacity>
        ) : null}
        {url.length ? (
          <TouchableOpacity style={styles.option} onPress={() => setUrl('')}>
            <Text style={styles.eraseText}>X</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView>
        <UrlAutocomplete onSubmit={onSubmitUrl} input={url} history={history} />
        {history.length ? (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearHistory}>
              {translate('browser.history.clear')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </Modal>
  );
};

const getStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    urlModal: {
      height: '100%',
      width: '100%',
      margin: 0,
      paddingTop: insets.top,
      justifyContent: 'flex-start',
      backgroundColor: 'white',
    },
    option: {alignSelf: 'center', marginLeft: 20},
    eraseText: {fontWeight: 'bold', fontSize: 16},
    urlModalContent: {
      flexDirection: 'row',
      borderColor: 'lightgrey',
      borderBottomWidth: 2,
      padding: 20,
      margin: 0,
    },
    urlInput: {flex: 1},
    clearHistory: {
      marginLeft: 20,
      marginTop: 20,
      fontWeight: 'bold',
    },
  });

export default UrlModal;
