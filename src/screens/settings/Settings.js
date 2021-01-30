import React from 'react';
import {StyleSheet, StatusBar, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import Separator from 'components/ui/Separator';
import {setRpc} from 'actions';
import HeaderDrawer from 'components/ui/HeaderDrawerScreens';
import CustomPicker from 'components/form/CustomPicker';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';

const AccountManagement = ({navigation, setRpcConnect, settings}) => {
  return (
    <SafeAreaView backgroundColor="white">
      <StatusBar backgroundColor="black" />
      <HeaderDrawer title="SETTINGS" navigation={navigation} />
      <View style={styles.view}>
        <Text style={styles.title}>RPC Nodes</Text>
        <Text style={styles.disclaimer}>
          You can chose which RPC node is used to read information and broadcast
          transactions from/to the Hive Blockchain.
        </Text>
        <Text style={styles.disclaimer}>
          Use "DEFAULT" RPC to let Hive Keychain chose the best RPC node at a
          given time.
        </Text>
        <Separator height={20} />
        <CustomPicker
          onSelected={setRpcConnect}
          selectedValue={settings.rpc}
          list={rpcList}
          prompt={translate('components.picker.prompt_rpc')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {paddingHorizontal: 20},
  title: {
    color: '#404950',
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  disclaimer: {color: '#404950', marginVertical: 2},
  button: {backgroundColor: '#B9122F'},
});

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, {
  setRpcConnect: setRpc,
})(AccountManagement);
