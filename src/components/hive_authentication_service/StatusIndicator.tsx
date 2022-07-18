import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {clearHAS, restartHASSockets} from 'utils/hiveAuthenticationService';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';
const LOGO_DARK = require('assets/has/logo-dark.png');

//TODO: Use all connection statuses. This will be useful when different servers work with Hive Auth.
export enum ConnectionStatus {
  VOID,
  DISCONNECTED,
  PARTIALLY_CONNECTED,
  CONNECTED,
}
const StatusIndicator = ({has}: PropsFromRedux) => {
  let status = ConnectionStatus.VOID;
  if (has.instances.length) {
    const connected = has.instances.filter((e) => e.init && e.connected).length;
    if (connected === 0) {
      status = ConnectionStatus.DISCONNECTED;
    } else if (connected === has.instances.length) {
      status = ConnectionStatus.CONNECTED;
    } else {
      status = ConnectionStatus.PARTIALLY_CONNECTED;
    }
  }

  const styles = getStyles(status);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.hasContainer}
        onPress={() => {
          navigate('ModalScreen', {
            name: ModalComponent.HAS_INFO,
          });
        }}>
        <Image source={LOGO_DARK} style={{height: 30, width: 30}} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (status === ConnectionStatus.DISCONNECTED) {
            restartHASSockets();
          }
        }}
        onLongPress={() => {
          clearHAS();
        }}
        style={styles.indicatorView}>
        <Indicator status={status} />
      </TouchableOpacity>
    </View>
  );
};

export const Indicator = ({status}: {status: ConnectionStatus}) => {
  const styles = getStyles(status);
  return (
    <View
      style={
        status === ConnectionStatus.CONNECTED ? styles.indicatorShadow : null
      }>
      <View style={styles.indicator}></View>
    </View>
  );
};

const getStyles = (status: ConnectionStatus) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 70,
    },
    hasContainer: {
      width: 25,
      height: 25,
      justifyContent: 'center',
    },
    indicatorView: {
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicatorShadow: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderColor: getStatusColor(status),
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicator: {
      backgroundColor: getStatusColor(status),
      width: 12,
      height: 12,
      borderRadius: 6,
    },
  });

const getStatusColor = (status: ConnectionStatus) => {
  switch (status) {
    case ConnectionStatus.CONNECTED:
      return 'green';
    case ConnectionStatus.DISCONNECTED:
      return 'red';
    case ConnectionStatus.PARTIALLY_CONNECTED:
      return 'yellow';
    case ConnectionStatus.VOID:
      return 'darkgrey';
  }
};
const mapStateToProps = (state: RootState) => {
  return {
    has: state.hive_authentication_service,
  };
};

type PropsFromRedux = ConnectedProps<typeof connector>;
const connector = connect(mapStateToProps, null);

export default connector(StatusIndicator);
