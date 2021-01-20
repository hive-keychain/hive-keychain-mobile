import React from 'react';
import {StyleSheet, StatusBar, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from 'components/ui/Separator';
import EllipticButton from 'components/form/EllipticButton';
import {updateSettings} from 'actions';
import HeaderDrawer from 'components/ui/HeaderDrawerScreens';

const AccountManagement = ({navigation, updateSettingsConnect}) => {
  return (
    <SafeAreaView backgroundColor="white">
      <StatusBar backgroundColor="black" />
      <HeaderDrawer title="WALLET KEYS" navigation={navigation} />
      <View style={styles.view}>
        <Text style={styles.disclaimer}>
          You can chose which RPC node is used to read information and broadcast
          transactions from/to the Hive Blockchain.
        </Text>
        <Text style={styles.disclaimer}>
          Use "DEFAULT" RPC to let Hive Keychain chose the best RPC node at a
          given time.
        </Text>
        <Separator height={20} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  disclaimer: {color: '#404950', marginVertical: 2, paddingHorizontal: 20},
  important: {color: '#A3112A', fontWeight: 'bold'},
  button: {backgroundColor: '#B9122F'},
  keyOdd: {backgroundColor: '#E5EEF7', padding: 20},
  keyEven: {backgroundColor: '#FFFFFF', padding: 20},
});

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {
  updateSettingsConnect: updateSettings,
})(AccountManagement);
