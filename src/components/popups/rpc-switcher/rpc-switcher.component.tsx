import {setActiveRpc} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup} from 'actions/rpc-switcher';
import OperationButton from 'components/form/EllipticButton';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {button_link_primary_small} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';

interface Props {
  initialRpc: Rpc;
}

const RpcSwitcherComponent = ({
  rpcSwitcher,
  setDisplayChangeRpcPopup,
  activeRpc,
  initialRpc,
  setActiveRpc,
}: Props & PropsFromRedux) => {
  const onHandleSwitchRPC = () => {
    setDisplayChangeRpcPopup(false);
    setActiveRpc(rpcSwitcher.rpc);
  };

  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return rpcSwitcher.display && rpcSwitcher.rpc && activeRpc ? (
    <View style={styles.popupBottom}>
      <Text style={[styles.white, {...button_link_primary_small}]}>
        {translate('settings.settings.rpc_not_responding_error', {
          currentRPC: initialRpc?.uri!,
          uri: rpcSwitcher.rpc.uri,
        })}
      </Text>
      <OperationButton
        style={[getButtonStyle(theme).warningStyleButton, styles.button]}
        additionalTextStyle={[styles.white, {...button_link_primary_small}]}
        title={`${translate('common.switch')} RPC`}
        isLoading={false}
        onPress={onHandleSwitchRPC}
      />
    </View>
  ) : null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    popupBottom: {
      position: 'absolute',
      bottom: 0,
      zIndex: 100,
      width: '100%',
      height: 'auto',
      backgroundColor: 'rgb(163, 17, 42)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingTop: 20,
    },
    button: {marginTop: 10, marginBottom: 15},
    white: {color: 'white'},
  });

const connector = connect(
  (state: RootState) => {
    return {
      rpcSwitcher: state.rpcSwitcher,
      activeRpc: state.activeRpc,
    };
  },
  {setDisplayChangeRpcPopup, setActiveRpc},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RpcSwitcherComponent);
