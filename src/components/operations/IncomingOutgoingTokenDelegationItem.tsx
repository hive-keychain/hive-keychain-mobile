import {loadAccount} from 'actions/index';
import {TokenBalance} from 'actions/interfaces';
import {showModal} from 'actions/message';
import Icon from 'components/hive/Icon';
import TwoFaModal from 'components/modals/TwoFaModal';
import ConfirmationInItem from 'components/ui/ConfirmationInItem';
import Separator from 'components/ui/Separator';
import React, {memo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getSeparatorLineStyle} from 'src/styles/line';
import {
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {RootState} from 'store';
import {withCommas} from 'utils/format';
import {cancelDelegateToken} from 'utils/hive';
import {TokenDelegation} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {TokenDelegationType} from './IncomingOutGoingTokenDelegations';

type Props = {
  tokenDelegation: TokenDelegation;
  delegationType: TokenDelegationType;
  tokenLogo: React.ReactNode;
  token: TokenBalance;
  tokenInfo: Token;
  theme: Theme;
  isMultisig: boolean;
  twoFABots: {[botName: string]: string};
} & PropsFromRedux;

const IncomingOutGoingTokenDelegationItem = ({
  tokenDelegation,
  delegationType,
  theme,
  user,
  loadAccount,
  showModal,
  isMultisig,
  twoFABots,
}: Props) => {
  const [isOutGoingDelegation, setIsOutGoingDelegation] = useState(
    delegationType === 'Outgoing',
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [cancelledSuccessfully, setCancelledSuccessfully] = useState(false);
  const [
    showCancelConfirmationDelegation,
    setShowCancelConfirmationDelegation,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const styles = getStyles(theme);

  if (cancelledSuccessfully) return null;
  const onDelete = async () => {
    const handleSubmit = async (options: TransactionOptions) => {
      setIsLoading(true);
      try {
        await cancelDelegateToken(
          user.keys.active,
          user.name!,
          {
            from: tokenDelegation.to,
            symbol: tokenDelegation.symbol,
            quantity: tokenDelegation.quantity,
          },
          options,
        );
        loadAccount(user.account.name, true);
        goBack();
        if (!isMultisig)
          showModal('toast.stop_delegation_success', MessageModalType.SUCCESS);
      } catch (e) {
        if (!isMultisig)
          showModal(
            `Error : ${(e as any).message}`,
            MessageModalType.ERROR,
            null,
            true,
          );
      } finally {
        setShowCancelConfirmationDelegation(false);
        setIsLoading(false);
      }
    };
    if (Object.entries(twoFABots).length > 0) {
      navigate('ModalScreen', {
        name: `2FA`,
        modalContent: (
          <TwoFaModal twoFABots={twoFABots} onSubmit={handleSubmit} />
        ),
      });
    } else {
      await handleSubmit({
        multisig: isMultisig,
        fromWallet: true,
      });
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIsExpanded(!isExpanded)}
      style={[styles.container, isExpanded ? styles.expandedContainer : null]}>
      {isOutGoingDelegation ? (
        <>
          <View style={styles.delegationItemContainer}>
            <Text style={[styles.textItem, styles.lowerOpacity]}>
              @{tokenDelegation.to}
            </Text>

            <View style={styles.flexRow}>
              <Text style={styles.textItem}>
                {withCommas(tokenDelegation.quantity)} {tokenDelegation.symbol}
              </Text>
              <Icon
                name={Icons.EXPAND_THIN}
                theme={theme}
                additionalContainerStyle={[
                  styles.marginLeft,
                  isExpanded ? undefined : styles.iconXAxisInverted,
                ]}
                {...styles.smallIcon}
                color={PRIMARY_RED_COLOR}
              />
            </View>
          </View>
          {isExpanded && (
            <>
              <Separator
                drawLine
                additionalLineStyle={getSeparatorLineStyle(theme, 0.5).itemLine}
              />
              {!showCancelConfirmationDelegation ? (
                <View style={styles.buttonRowContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.button}
                    onPress={() => {
                      setShowCancelConfirmationDelegation(true);
                    }}>
                    <Icon
                      name={Icons.GIFT_DELETE}
                      theme={theme}
                      {...styles.icon}
                      color={PRIMARY_RED_COLOR}
                    />
                    <Text style={styles.buttonText}>
                      {translate('common.delete')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 15,
                  }}>
                  <ConfirmationInItem
                    theme={theme}
                    titleKey="wallet.operations.delegation.confirm_cancel_delegation"
                    onConfirm={onDelete}
                    onCancel={() => setShowCancelConfirmationDelegation(false)}
                    isLoading={isLoading}
                    // additionalConfirmTextStyle={styles.whiteText}
                  />
                </View>
              )}
            </>
          )}
        </>
      ) : (
        <View style={styles.delegationItemContainer}>
          <View style={styles.flexRow}>
            <Icon
              name={Icons.AT}
              theme={theme}
              width={15}
              height={15}
              additionalContainerStyle={styles.marginRight}
            />
            <Text style={styles.textItem}>{tokenDelegation.from}</Text>
          </View>
          <Text style={styles.textItem}>
            {tokenDelegation.quantity} {tokenDelegation.symbol}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 9,
      borderRadius: 66,
      borderWidth: 1,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    delegationItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 19,
      paddingHorizontal: 15,
    },
    customInputStyle: {
      width: '40%',
      borderWidth: 1,
      marginTop: 4,
      marginBottom: 4,
      borderRadius: 8,
      marginLeft: 4,
      padding: 6,
      color: getColors(theme).secondaryText,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonRowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexEnd: {justifyContent: 'flex-end'},
    textItem: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    marginRight: {
      marginRight: 3,
    },
    lowerOpacity: {
      opacity: 0.7,
    },
    roundButton: {
      borderWidth: 1,
      borderColor: getColors(theme).quinaryCardBorderColor,
      borderRadius: 100,
      width: 25,
      height: 25,
    },
    icon: {
      width: 18,
      height: 18,
    },
    smallIcon: {
      width: 12,
      height: 12,
    },
    iconXAxisInverted: {
      transform: [{rotateX: '180deg'}],
    },
    marginLeft: {
      marginLeft: 8,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '30%',
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      paddingVertical: 10,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_3,
      marginLeft: 8,
    },
    expandedContainer: {
      paddingVertical: 10,
      borderRadius: 40,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default memo(connector(IncomingOutGoingTokenDelegationItem));
