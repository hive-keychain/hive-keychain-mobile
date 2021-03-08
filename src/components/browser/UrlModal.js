import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Modal from 'react-native-modal';

const UrlModal = ({isVisible, toggle, onNewSearch, initialValue}) => {
  const [url, setUrl] = useState(initialValue);
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
      animationInTiming={500}
      animationOutTiming={500}
      useNativeDriver>
      <View style={styles.urlModalContent}>
        <TextInput
          keyboardType="web-search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={setUrl}
          onSubmitEditing={onNewSearch}
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
