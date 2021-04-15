import React, {useRef} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Modal from 'react-native-modal';
const SLIDE_TIME = 500;

const UrlModal = ({isVisible, toggle, onNewSearch, url, setUrl}) => {
  const urlInput = useRef();

  if (isVisible && urlInput) {
    setTimeout(() => {
      const {current} = urlInput;
      if (current && !current.isFocused()) {
        current.focus();
      }
    }, SLIDE_TIME);
  }

  return (
    <Modal
      isVisible={isVisible}
      style={styles.urlModal}
      onBackdropPress={() => {
        toggle(false);
      }}
      onBackButtonPress={() => {
        toggle(false);
      }}
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
          onSubmitEditing={(obj) => {
            toggle(false);
            const url = obj.nativeEvent.text;
            const hasProtocol = url.match(/^[a-z]*:\/\//);
            const sanitizedURL = hasProtocol ? url : `https://${url}`;
            onNewSearch(sanitizedURL);
          }}
          placeholder={'Please enter the url'}
          returnKeyType="go"
          style={styles.urlInput}
          value={url}
          selectTextOnFocus
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  urlModal: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    margin: 0,
    justifyContent: 'flex-start',
  },
  urlModalContent: {backgroundColor: 'white'},
  urlInput: {borderColor: 'lightgrey', borderBottomWidth: 2, padding: 20},
});

export default UrlModal;
