import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import {setRpc} from 'actions/index';
import CustomPicker from 'components/form/CustomPicker';
import {rpcList} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import { RootState } from 'store';

const AccountManagement = ({ setRpc, settings}:PropsFromRedux) => {
  return (
    <SafeArea>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.view}>
        <Text style={styles.title}>{translate('settings.settings.title')}</Text>
        
        {//@ts-ignore
        translate('settings.settings.disclaimer').map((disclaimer, i) => (
          <Text key={i} style={styles.disclaimer}>
            {disclaimer}
          </Text>
        ))}
        <Separator height={20} />
        <CustomPicker
          onSelected={setRpc}
          selectedValue={settings.rpc}
          list={rpcList}
          prompt={translate('components.picker.prompt_rpc')}
        />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  view: {paddingHorizontal: 20, backgroundColor: 'white', height: '100%'},
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

const mapStateToProps = (state:RootState) => ({
  settings: state.settings,
});
const connector=connect(mapStateToProps, {
  setRpc,
});
type PropsFromRedux=ConnectedProps<typeof connector>
export default connector(AccountManagement);
