import Conversion from 'assets/wallet/icon_convert.svg';
import Delegate from 'assets/wallet/icon_delegate.svg';
import HistoryIcon from 'assets/wallet/icon_history.svg';
import Power from 'assets/wallet/icon_power.svg';
import SendArrow from 'assets/wallet/icon_send.svg';
import Convert from 'components/operations/Convert';
import Delegation from 'components/operations/Delegation';
import History, {HistoryProps} from 'components/operations/History';
import PowerDown from 'components/operations/PowerDown';
import PowerUp from 'components/operations/PowerUp';
import Transfer from 'components/operations/Transfer';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {navigate} from 'utils/navigation';

type RoundButtonProps = {
  size: number;
  content: JSX.Element;
  backgroundColor: string;
  onPress: () => void;
};
const RoundButton = ({
  size,
  content,
  backgroundColor,
  onPress,
}: RoundButtonProps) => {
  const styles = getStyleSheet(size, backgroundColor);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>{content}</View>
    </TouchableOpacity>
  );
};

type SendProps = {
  currency: string;
  tokenBalance?: number;
  engine?: boolean;
  tokenLogo?: JSX.Element;
};
export const Send = ({
  currency,
  tokenBalance,
  engine,
  tokenLogo,
}: SendProps) => {
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

export const SendConversion = () => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <Convert />,
        });
      }}
      size={36}
      backgroundColor="#A3112A"
      content={<Conversion />}
    />
  );
};

export const ShowHistory = (props: HistoryProps) => {
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

const getStyleSheet = (size: number, backgroundColor: string) =>
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
