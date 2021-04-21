import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UrlAutocomplete from './UrlAutocomplete';
import {translate} from 'utils/localize';

const SLIDE_TIME = 500;

const UrlModal = ({
  isVisible,
  toggle,
  onNewSearch,
  url,
  setUrl,
  history,
  clearHistory,
}) => {
  const urlInput = useRef();
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

  const onSubmitUrlFromInput = (obj) => {
    const url = obj.nativeEvent.text;
    onSubmitUrl(url);
  };

  const onSubmitUrl = (url) => {
    toggle(false);
    const hasProtocol = url.match(/^[a-z]*:\/\//);
    const sanitizedURL = hasProtocol ? url : `https://${url}`;
    onNewSearch(sanitizedURL);
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
          clearButtonMode="while-editing"
          onChangeText={setUrl}
          onSubmitEditing={onSubmitUrlFromInput}
          placeholder={'Please enter the url'}
          returnKeyType="go"
          style={styles.urlInput}
          value={url}
          selectTextOnFocus
        />
      </View>
      <UrlAutocomplete
        onSubmit={onSubmitUrl}
        input={url}
        history={history}
        onDismiss={dismissModal}
      />
      {history.length ? (
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clearHistory}>
            {translate('browser.history.clear')}
          </Text>
        </TouchableOpacity>
      ) : null}
    </Modal>
  );
};

const getStyles = (insets) =>
  StyleSheet.create({
    urlModal: {
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
      margin: 0,
      padding: insets.top,
      justifyContent: 'flex-start',
    },
    urlModalContent: {backgroundColor: 'white'},
    urlInput: {borderColor: 'lightgrey', borderBottomWidth: 2, padding: 20},
    clearHistory: {
      marginLeft: 20,
      marginTop: 20,
      fontWeight: 'bold',
    },
  });

export default UrlModal;
