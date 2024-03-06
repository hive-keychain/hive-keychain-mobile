import Clipboard from '@react-native-community/clipboard';
import {ActionPayload, BrowserPayload, Page} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
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
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {title_primary_body_2} from 'src/styles/typography';
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
  theme: Theme;
};
const UrlModal = ({
  isVisible,
  toggle,
  onNewSearch,
  url,
  setUrl,
  history,
  clearHistory,
  theme,
}: Props) => {
  const urlInput: MutableRefObject<TextInput> = useRef();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets, theme);
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
          style={[styles.textBase, styles.urlInput]}
          value={url}
          selectTextOnFocus
          placeholderTextColor={getColors(theme).secondaryText}
        />
        {url.length ? (
          <Icon
            name={Icons.SHARE}
            theme={theme}
            width={16}
            height={16}
            onClick={() => Share.share({message: url})}
            additionalContainerStyle={styles.option}
            color={PRIMARY_RED_COLOR}
          />
        ) : null}
        {url.length ? (
          <Icon
            name={Icons.COPY}
            theme={theme}
            width={16}
            height={16}
            onClick={() => Clipboard.setString(url)}
            additionalContainerStyle={styles.option}
            color={PRIMARY_RED_COLOR}
          />
        ) : null}
        {url.length ? (
          <TouchableOpacity style={styles.option} onPress={() => setUrl('')}>
            <Text style={[styles.textBase, styles.eraseText]}>x</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView style={[styles.containerHistory]}>
        <UrlAutocomplete
          onSubmit={onSubmitUrl}
          input={url}
          history={history}
          theme={theme}
        />
        {history.length ? (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={[styles.textBase, styles.clearHistory]}>
              {translate('browser.history.clear')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </Modal>
  );
};

const getStyles = (insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    urlModal: {
      height: '100%',
      width: '100%',
      margin: 0,
      paddingTop: insets.top,
      justifyContent: 'flex-start',
      backgroundColor: getColors(theme).secondaryCardBgColor,
    },
    option: {alignSelf: 'center', marginLeft: 20},
    eraseText: {fontSize: 16, color: PRIMARY_RED_COLOR},
    urlModalContent: {
      flexDirection: 'row',
      borderColor: 'lightgrey',
      borderBottomWidth: 2,
      padding: 20,
      margin: 0,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    urlInput: {
      flex: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      borderRadius: 15,
      paddingLeft: MARGIN_PADDING,
    },
    clearHistory: {
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 20,
      fontWeight: 'bold',
    },
    containerHistory: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      paddingHorizontal: 10,
    },
  });

export default UrlModal;
