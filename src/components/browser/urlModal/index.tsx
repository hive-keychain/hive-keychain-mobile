import {ActionPayload, BrowserPayload, Page} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import * as Clipboard from 'expo-clipboard';
import React, {MutableRefObject, useRef} from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {FontPoppinsName, title_primary_body_3} from 'src/styles/typography';
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
  clearCache: () => void;
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
  clearCache,
  theme,
}: Props) => {
  const urlInput: MutableRefObject<TextInput> = useRef(null);
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets, theme);

  const onSubmitUrlFromInput = (
    obj: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    const url = obj.nativeEvent.text;
    onSubmitUrl(url);
  };

  const onSubmitUrl = (url: string) => {
    toggle(false);
    // Add duckduck go search for url with no domain
    if (url.includes(' ') || (!url.includes('.') && !url.includes(':'))) {
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
      style={[styles.urlModal]}
      onBackdropPress={dismissModal}
      onBackButtonPress={dismissModal}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      backdropOpacity={0.8}
      onModalShow={() => {
        setTimeout(() => {
          const {current} = urlInput;
          if (current && !current.isFocused()) {
            current.focus();
          }
        }, 500);
      }}
      animationInTiming={SLIDE_TIME}
      avoidKeyboard
      animationOutTiming={SLIDE_TIME}
      useNativeDriver>
      <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
        <View style={styles.urlModalContent}>
          <Icon
            name={Icons.ARROW_LEFT}
            theme={theme}
            width={17}
            height={17}
            onPress={() => toggle(false)}
            additionalContainerStyle={styles.option}
            color={PRIMARY_RED_COLOR}
          />
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
              width={17}
              height={17}
              onPress={() => Share.share({message: url})}
              additionalContainerStyle={styles.option}
              color={PRIMARY_RED_COLOR}
            />
          ) : null}
          {url.length ? (
            <Icon
              name={Icons.COPY}
              theme={theme}
              width={17}
              height={17}
              onPress={() => Clipboard.setStringAsync(url)}
              additionalContainerStyle={styles.option}
              color={PRIMARY_RED_COLOR}
            />
          ) : null}
          {url.length ? (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.option}
              onPress={() => setUrl('')}>
              <Text style={[styles.textBase, styles.eraseText]}>x</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={[styles.containerHistory]}>
          <View style={styles.clearHistoryContainer}>
            <TouchableOpacity activeOpacity={1} onPress={clearCache}>
              <Text style={[styles.textBase, styles.clearHistory]}>
                {translate('browser.history.clear_cache')}
              </Text>
            </TouchableOpacity>
            {history.length ? (
              <TouchableOpacity activeOpacity={1} onPress={clearHistory}>
                <Text style={[styles.textBase, styles.clearHistory]}>
                  {translate('browser.history.clear')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <UrlAutocomplete
            onSubmit={onSubmitUrl}
            input={url}
            history={history}
            theme={theme}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const getStyles = (insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    urlModal: {
      flexGrow: 1,
      width: '100%',
      margin: 0,
      paddingTop: Platform.OS === 'ios' ? insets.top / 2 : 0,
      justifyContent: 'flex-start',
      backgroundColor: getColors(theme).secondaryCardBgColor,
    },
    option: {alignSelf: 'center', padding: 10},
    eraseText: {fontSize: 18, color: PRIMARY_RED_COLOR},
    urlModalContent: {
      flexDirection: 'row',
      borderColor: 'lightgrey',
      borderBottomWidth: 2,
      padding: 10,
      margin: 0,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_3,
      fontSize: 14,
      fontFamily: FontPoppinsName.REGULAR,
    },
    urlInput: {
      flex: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      height: 50,
      borderRadius: 15,
      paddingLeft: MARGIN_PADDING,
    },
    clearHistoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    clearHistory: {
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 0,
      fontWeight: 'bold',
    },
    containerHistory: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      paddingHorizontal: 10,
      flexGrow: 1,
    },
  });

export default UrlModal;
