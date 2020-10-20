import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {navigate} from 'utils/navigation';

import Transfer from 'components/operations/Transfer';
import PowerUp from 'components/operations/PowerUp';
import PowerDown from 'components/operations/PowerDown';
import Delegation from 'components/operations/Delegation';
import History from 'components/operations/History';

import Power from 'assets/wallet/icon_power.svg';
import SendArrow from 'assets/wallet/icon_send.svg';
import Delegate from 'assets/wallet/icon_delegate.svg';
import HistoryIcon from 'assets/wallet/icon_history.svg';

const RoundButton = ({size, content, backgroundColor, onPress}) => {
  const styles = getStyleSheet(size, backgroundColor);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>{content}</View>
    </TouchableOpacity>
  );
};

export const Send = ({currency, tokenBalance, engine, tokenLogo}) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: (
            <Transfer
              currency={currency}
              tokenBalance={tokenBalance}
              engine={engine}
              tokenLogo={tokenLogo}
            />
          ),
        });
      }}
      size={36}
      backgroundColor="#77B9D1"
      content={<SendArrow />}
    />
  );
};

export const SendPowerUp = () => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <PowerUp />,
        });
      }}
      size={36}
      backgroundColor="#E59D15"
      content={<Power />}
    />
  );
};

export const SendPowerDown = () => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <PowerDown />,
        });
      }}
      size={36}
      backgroundColor="#000000"
      content={<Power />}
    />
  );
};

export const SendDelegation = () => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <Delegation />,
        });
      }}
      size={36}
      backgroundColor="#B084C4"
      content={<Delegate />}
    />
  );
};

export const ShowHistory = (props) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <History {...props} />,
        });
      }}
      size={36}
      backgroundColor="#69C1B3"
      content={<HistoryIcon />}
    />
  );
};

const getStyleSheet = (size, backgroundColor) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {},
  });

export default RoundButton;
