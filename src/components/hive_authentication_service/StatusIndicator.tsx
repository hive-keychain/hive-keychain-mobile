import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {RootState} from 'store';
import {restartHASSockets} from 'utils/hiveAuthenticationService';
import {ModalComponent} from 'utils/modal.enum';
import {navigate} from 'utils/navigation';

export enum ConnectionStatus {
  VOID,
  DISCONNECTED,
  PARTIALLY_CONNECTED,
  CONNECTED,
}

interface Props {
  theme: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
}

const StatusIndicator = ({
  has,
  theme,
  additionalContainerStyle,
}: PropsFromRedux & Props) => {
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
      activeOpacity={1}
      style={styles.container}
      onLongPress={() => {
        navigate('ModalScreen', {
          name: ModalComponent.HAS_INFO,
        });
      }}
      onPress={() => {
        if (status === ConnectionStatus.DISCONNECTED) {
          restartHASSockets();
        }
      }}>
      <Indicator theme={theme} status={status} />
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
    <View style={styles.indicator}>
      <Icon theme={theme} name={Icons.LOGO_HAS} width={15} height={15} />
    </View>
  );
};

const getStyles = (status: ConnectionStatus, theme: Theme) =>
  StyleSheet.create({
    container: {
      marginRight: 8,
    },
    indicator: {
      borderColor: getStatusColor(status),
      padding: 4,
      borderRadius: 50,
      borderWidth: 2,
      backgroundColor: '#FFF',
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
