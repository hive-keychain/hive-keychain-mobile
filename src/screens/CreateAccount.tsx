import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Background from 'components/ui/Background';

const CreateAccount = () => {
  return (
    <Background containerStyle={styles.container}>
      <Text h1 style={styles.text}>
        Coming Soon ...
      </Text>
    </Background>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateAccount;
