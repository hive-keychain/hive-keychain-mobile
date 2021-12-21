import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {clearHAS, restartHASSockets} from 'utils/hiveAuthenticationService';

//TODO: Use all connection statuses
enum ConnectionStatus {
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
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log('pressing');
        if (status === ConnectionStatus.CONNECTED) {
          clearHAS();
        } else if (status === ConnectionStatus.DISCONNECTED) {
          restartHASSockets();
        }
      }}
      onLongPress={() => {}}>
      <Text style={styles.text}>HAS</Text>
      <View style={styles.indicator}></View>
    </TouchableOpacity>
  );
};

const getStyles = (status: ConnectionStatus) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 25,
      height: 25,
    },
    text: {color: 'white', fontSize: 10},
    indicator: {
      backgroundColor: getStatusColor(status),
      width: 10,
      height: 10,
      borderRadius: 5,
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
