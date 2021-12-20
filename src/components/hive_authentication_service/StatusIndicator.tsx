import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {clearHAS} from 'utils/hiveAuthenticationService';

//TODO: Use all connection statuses
enum ConnectionStatus {
  VOID,
  DISCONNECTED,
  PARTIALLY_CONNECTED,
  CONNECTED,
}
const StatusIndicator = ({has}: PropsFromRedux) => {
  const status = has.instances.length && !!has.instances.find((e) => e.init); // && !e.stopped);
  const styles = getStyles(status);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {}}
      onLongPress={() => {}}>
      <Text style={styles.text}>HAS</Text>
      <TouchableOpacity
        onPress={() => {
          console.log('hmm');
          clearHAS();
        }}>
        <View style={styles.indicator}></View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const getStyles = (status: boolean) =>
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
      backgroundColor: status ? 'green' : 'darkgrey',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
const mapStateToProps = (state: RootState) => {
  return {
    has: state.hive_authentication_service,
  };
};
type PropsFromRedux = ConnectedProps<typeof connector>;
const connector = connect(mapStateToProps, null);
export default connector(StatusIndicator);
