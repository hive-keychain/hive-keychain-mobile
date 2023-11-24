import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {GREENINFO, getColors} from 'src/styles/colors';
import {RootState} from 'store';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';

//TODO fix styles & usability of this
//TODO: add functionality to the 'clear all buttons' as "It deletes all hiveAuth sessions"
//TODO: Use all connection statuses. This will be useful when different servers work with Hive Auth.
export enum ConnectionStatus {
  VOID,
  DISCONNECTED,
  PARTIALLY_CONNECTED,
  CONNECTED,
}

interface Props {
  theme: Theme;
}

const StatusIndicator = ({has, theme}: PropsFromRedux & Props) => {
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

  const styles = getStyles(status, theme);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigate('ModalScreen', {
          name: ModalComponent.HAS_INFO,
        });
      }}>
      <Icon theme={theme} name="logo_has" />
    </TouchableOpacity>
  );
};

export const Indicator = ({
  status,
  theme,
}: {
  status: ConnectionStatus;
  theme: Theme;
}) => {
  const styles = getStyles(status, theme);
  return (
    <View
      style={
        status === ConnectionStatus.CONNECTED ? styles.indicatorShadow : null
      }>
      <View style={styles.indicator}></View>
    </View>
  );
};

const getStyles = (status: ConnectionStatus, theme: Theme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 33,
      height: 33,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: GREENINFO,
      alignSelf: 'center',
      marginRight: 8,
      backgroundColor: getColors(theme).secondaryCardBgColor,
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
