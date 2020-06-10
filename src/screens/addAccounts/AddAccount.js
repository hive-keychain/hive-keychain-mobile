import React from 'react';
import {StyleSheet, Button} from 'react-native';
import {Text} from 'react-native-elements';
import Separator from '../../components/Separator';

const AddAccount = ({navigation}) => {
  return (
    <>
      <Separator />
      <Text h3 style={styles.textCentered}>
        Add or import accounts
      </Text>
      <Separator />
      <Text>
        You can add your keys by entring a private key or your master password.
        Alternatively, you can specify an authorized account or import your
        keys.
      </Text>
      <Separator />
      <Button
        title="Use Keys/Password"
        onPress={() => {
          navigation.navigate('AddAccountByKeyScreen');
        }}
      />
      <Separator />
      <Button
        title="Use Authorized Account"
        onPress={() => {
          navigation.navigate('AddAccountByAuthScreen');
        }}
      />
      <Separator />
      <Button
        title="Import Keys"
        onPress={() => {
          navigation.navigate('ImportScreen');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default AddAccount;
