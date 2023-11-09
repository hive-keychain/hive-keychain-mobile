import HistoryIcon from 'assets/new_UI/back_time.svg';
import SendIcon from 'assets/new_UI/send.svg';
import AddIconWhite from 'assets/wallet/icon_add_circle_outline_white.svg';
import Conversion from 'assets/wallet/icon_convert.svg';
import Delegate from 'assets/wallet/icon_delegate.svg';
import Plus from 'assets/wallet/icon_deposit.svg';
import Power from 'assets/wallet/icon_power.svg';
import ShoppingCartIconWhite from 'assets/wallet/icon_shopping_cart_white.svg';
import Minus from 'assets/wallet/icon_withdraw.svg';
import PendingSavingsWithdrawalPageComponent from 'components/hive/Pending-savings-withdrawal-page.component';
import Convert from 'components/operations/Convert';
import Delegation from 'components/operations/Delegation';
import PowerDown from 'components/operations/PowerDown';
import PowerUp from 'components/operations/PowerUp';
import Transfer from 'components/operations/Transfer';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {getColors} from 'src/styles/colors';
import {navigate} from 'utils/navigation';
import BuyCoinsComponent, {BuyCoinsprops} from './Buy-coins.component';
import MoreTokenInfo, {MoreInfoTokenProps} from './MoreTokenInfo';
import Savings, {SavingsOperations} from './Savings';
import {TokenHistoryProps} from './Tokens-history';

type RoundButtonProps = {
  size: number;
  content: JSX.Element;
  backgroundColor: string;
  onPress: () => void;
  additionalButtonStyle?: StyleProp<ViewStyle>;
};
const RoundButton = ({
  size,
  content,
  backgroundColor,
  onPress,
  additionalButtonStyle,
}: RoundButtonProps) => {
  const styles = getStyleSheet(size, backgroundColor);
  return (
    <TouchableOpacity
      style={[styles.container, additionalButtonStyle]}
      onPress={onPress}>
      <View style={styles.content}>{content}</View>
    </TouchableOpacity>
  );
};

type SendProps = {
  currency: string;
  tokenBalance?: string;
  engine?: boolean;
  tokenLogo?: JSX.Element;
  additionalButtonStyle?: StyleProp<ViewStyle>;
  theme: Theme;
};
export const Send = ({
  currency,
  tokenBalance,
  engine,
  tokenLogo,
  additionalButtonStyle,
  theme,
}: SendProps) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: engine ? 'TransferEngine' : 'Transfer',
          modalContent: (
            <Transfer
              currency={currency}
              tokenBalance={tokenBalance}
              engine={engine}
              tokenLogo={tokenLogo}
            />
          ),
          modalContainerStyle: {
            height: '100%',
          } as StyleProp<ViewStyle>,
        });
      }}
      size={36}
      backgroundColor="#77B9D1"
      content={<SendIcon color={getColors(theme).icon} />}
      additionalButtonStyle={additionalButtonStyle}
    />
  );
};

export const SendPowerUp = () => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'PowerUp',
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
          name: 'PowerDown',
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
          name: 'Delegation',
          modalContent: <Delegation />,
        });
      }}
      size={36}
      backgroundColor="#B084C4"
      content={<Delegate />}
    />
  );
};

export const SendConversion = ({currency}: {currency: string}) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'Convert',
          modalContent: <Convert currency={currency} />,
        });
      }}
      size={36}
      backgroundColor={currency === 'HBD' ? '#A3112A' : '#005C09'}
      content={<Conversion />}
    />
  );
};

export const SendWithdraw = ({currency}: {currency: string}) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'Widthdraw',
          modalContent: (
            <Savings
              operation={SavingsOperations.withdraw}
              currency={currency}
            />
          ),
        });
      }}
      size={36}
      backgroundColor="#7E8C9A"
      content={<Minus />}
    />
  );
};

export const SendDeposit = ({currency}: {currency: string}) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'Deposit',
          modalContent: (
            <Savings
              operation={SavingsOperations.deposit}
              currency={currency}
            />
          ),
        });
      }}
      size={36}
      backgroundColor="#7E8C9A"
      content={<Plus />}
    />
  );
};
//TODO important on this file: check what's needed & cleanup
export const PendingSavingsWithdraw = ({
  currentWithdrawingList,
  children,
}: {
  currentWithdrawingList: SavingsWithdrawal[];
  children: JSX.Element;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {
          name: 'CancelSavingsWithdraw',
          modalContent: (
            <PendingSavingsWithdrawalPageComponent
              operation={SavingsOperations.deposit}
              currency={'HBD'}
              currentWithdrawingList={currentWithdrawingList}
              onUpdate={() => {}}
            />
          ),
        });
      }}>
      {children}
    </TouchableOpacity>
  );
};

export const ShowHistory = (props: TokenHistoryProps) => {
  return (
    <RoundButton
      onPress={() => {
        //TODO change bellow to a stack screen instead.
        //  - maybe add a general stack page that can be reused anytime.

        //TODO bellow pass the needed props
        navigate('TokensHistory', {...props});
      }}
      size={36}
      backgroundColor="#69C1B3"
      content={<HistoryIcon color={getColors(props.theme).icon} />}
      // additionalButtonStyle={props.additionalButtonStyle}
    />
  );
};

export const ShowMoreTokenInfo = (props: MoreInfoTokenProps) => {
  return props.tokenInfo.stakingEnabled || props.tokenInfo.delegationEnabled ? (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'EngineTokenInfo',
          modalContent: <MoreTokenInfo {...props} />,
        });
      }}
      size={36}
      backgroundColor="#32393c"
      content={<AddIconWhite />}
    />
  ) : null;
};

export const BuyCoins = (props: BuyCoinsprops) => {
  return (
    <RoundButton
      onPress={() => {
        navigate('ModalScreen', {
          name: 'BuyCoinsInfo',
          modalContent: <BuyCoinsComponent {...props} />,
          fixedHeight: 0.75,
        });
      }}
      size={36}
      backgroundColor={props.iconColor}
      content={<ShoppingCartIconWhite />}
    />
  );
};

const getStyleSheet = (
  size: number,
  backgroundColor: string,
  marginLeft?: number,
) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: marginLeft,
    },
    content: {},
  });

export default RoundButton;
