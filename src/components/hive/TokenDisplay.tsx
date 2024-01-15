import {Currency, Token} from 'actions/interfaces';
import {DelegateTokenOperationProps} from 'components/operations/DelegateToken';
import IncomingOutGoingTokenDelegations from 'components/operations/IncomingOutGoingTokenDelegations';
import RoundButton from 'components/operations/OperationsButtons';
import {StakeTokenOperationProps} from 'components/operations/StakeToken';
import {TransferOperationProps} from 'components/operations/Transfer';
import {UnstakeTokenOperationProps} from 'components/operations/UnstakeToken';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {
  Linking,
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {
  BUTTON_ICON_TEXT_MARGIN,
  BUTTON_MARGIN_BETWEEN,
} from 'src/styles/button';
import {BORDERWHITISH, getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
  fields_primary_text_2,
  getFontSizeSmallDevices,
  title_secondary_body_3,
} from 'src/styles/typography';
import {formatBalance} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Icon from './Icon';

type Props = {
  name: string;
  logo: JSX.Element;
  currency: string;
  value: number;
  totalValue: number;
  color: string;
  price?: Currency;
  buttons?: JSX.Element[];
  toggled: boolean;
  setToggle: () => void;
  onHandleGoToTokenHistory: () => void;
  renderButtonOptions?: boolean;
  theme: Theme;
  tokenInfo?: Token;
  tokenBalance?: TokenBalance;
  additionalButtonStyle?: StyleProp<ViewStyle>;
};

const TokenDisplay = ({
  name,
  logo,
  currency,
  value,
  buttons,
  color,
  price,
  toggled,
  setToggle,
  renderButtonOptions,
  theme,
  tokenInfo,
  totalValue,
  tokenBalance,
  onHandleGoToTokenHistory,
  additionalButtonStyle,
}: Props) => {
  const styles = getDimensionedStyles({
    color,
    ...useWindowDimensions(),
    change: price ? price.usd_24h_change! + '' : '0',
    theme,
  });
  const tokenTotalValue = value ? formatBalance(totalValue) : 0;

  const renderAsSquareButton = (
    icon: JSX.Element,
    label: string,
    onPress: () => void,
  ) => (
    <RoundButton
      size={22}
      onPress={onPress}
      backgroundColor="black"
      content={
        <View style={styles.innerButtonContainer}>
          <View style={styles.iconButtonContainer}>{icon}</View>
          <Text style={styles.textButton}>{label}</Text>
        </View>
      }
      additionalButtonStyle={[styles.squareButton, additionalButtonStyle]}
    />
  );

  const onTransfer = () => {
    navigate('Operation', {
      operation: 'transfer',
      props: {
        currency: currency,
        tokenBalance: tokenBalance.balance,
        engine: true,
        tokenLogo: logo,
      } as TransferOperationProps,
    });
  };

  const onGoToIncoming = () =>
    navigate('TemplateStack', {
      titleScreen: 'Incoming',
      component: (
        <IncomingOutGoingTokenDelegations
          delegationType={'Incoming'}
          total={tokenBalance.delegationsIn}
          token={tokenBalance}
          tokenLogo={logo}
          tokenInfo={tokenInfo}
        />
      ),
    } as TemplateStackProps);

  const onGoToOutgoing = () =>
    navigate('TemplateStack', {
      titleScreen: 'Outgoing',
      component: (
        <IncomingOutGoingTokenDelegations
          delegationType={'Outgoing'}
          total={tokenBalance.delegationsOut}
          token={tokenBalance}
          tokenLogo={logo}
          tokenInfo={tokenInfo}
        />
      ),
    } as TemplateStackProps);

  const onGoToStake = () =>
    navigate('Operation', {
      operation: 'stake',
      props: {
        currency: currency,
        balance: tokenBalance.balance,
        tokenLogo: logo,
      } as StakeTokenOperationProps,
    });

  const onGoToUnstake = () =>
    navigate('Operation', {
      operation: 'unstake',
      props: {
        currency: currency,
        balance: (
          parseFloat(tokenBalance.stake) -
          parseFloat(tokenBalance.pendingUnstake)
        ).toString(),
        tokenLogo: logo,
        tokenInfo: tokenInfo,
      } as UnstakeTokenOperationProps,
    });

  const onGoToDelegate = () =>
    navigate('Operation', {
      operation: 'delegate',
      props: {
        currency: currency,
        balance: tokenBalance.stake,
        tokenLogo: logo,
      } as DelegateTokenOperationProps,
    });

  return (
    <TouchableOpacity onPress={() => setToggle()} style={styles.container}>
      <View style={styles.flexRowBetween}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.logo}>{logo}</View>
          <View style={[styles.flexColumnCentered, styles.containerMarginLeft]}>
            <Text style={styles.textSymbol}>{currency}</Text>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              width: 'auto',
              justifyContent: 'flex-end',
            },
          ]}>
          {renderButtonOptions && buttons}
          <Text style={styles.textAmount}>
            {value ? formatBalance(value) : 0}
          </Text>
          {toggled && (
            <Icon
              key={`show-token-history-${currency}`}
              name={Icons.BACK_TIME}
              onClick={onHandleGoToTokenHistory}
              additionalContainerStyle={[
                styles.squareButton,
                styles.containerMarginLeft,
                styles.historyButton,
              ]}
              theme={theme}
            />
          )}
        </View>
      </View>
      {toggled && (
        <View style={styles.expandedItemContainer}>
          {tokenInfo && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://peakd.com/@${tokenInfo.issuer}`)
              }>
              <Text style={styles.textBodyItem}>@{tokenInfo.issuer}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.textBodyItem}>
            {translate('wallet.operations.tokens.total_value')} : $
            {tokenTotalValue} (${tokenTotalValue}/Token)
          </Text>
          <Text style={styles.textBodyItem}>
            {translate('wallet.operations.tokens.liquid_balance')} :{' '}
            {value ? formatBalance(value) : 0}
          </Text>
          {tokenBalance && parseFloat(tokenBalance.delegationsIn) > 0 && (
            <View style={styles.flexRowAligned}>
              <Text style={styles.textBodyItem}>
                {translate('wallet.operations.tokens.incoming')} :{' '}
                {tokenBalance.delegationsIn}
              </Text>
              <Icon
                name={Icons.LOGOUT}
                theme={theme}
                width={15}
                height={15}
                additionalContainerStyle={[
                  styles.containerMarginLeft,
                  styles.invertXAxis,
                ]}
                onClick={onGoToIncoming}
              />
            </View>
          )}
          {tokenBalance && parseFloat(tokenBalance.delegationsOut) > 0 && (
            <View style={styles.flexRowAligned}>
              <Text style={styles.textBodyItem}>
                {translate('wallet.operations.tokens.outgoing')} :{' '}
                {tokenBalance.delegationsOut}
              </Text>
              <Icon
                name={Icons.LOGOUT}
                theme={theme}
                width={15}
                height={15}
                additionalContainerStyle={styles.containerMarginLeft}
                onClick={onGoToOutgoing}
              />
            </View>
          )}
          {tokenInfo && tokenInfo.stakingEnabled && tokenBalance.stake && (
            <Text style={styles.textBodyItem}>
              {translate('wallet.operations.tokens.total_staked')} :{' '}
              {tokenBalance.stake}
            </Text>
          )}
          {tokenInfo &&
            tokenInfo.stakingEnabled &&
            tokenBalance.pendingUnstake &&
            parseFloat(tokenBalance.pendingUnstake) > 0 && (
              <Text style={styles.textBodyItem}>
                {translate('wallet.operations.tokens.pending_unstake')} :{' '}
                {tokenBalance.pendingUnstake}
              </Text>
            )}
          <View style={styles.buttonsContainer}>
            {renderAsSquareButton(
              <Icon
                theme={theme}
                name={Icons.TRANSFER}
                width={16}
                height={16}
              />,
              translate('common.send'),
              onTransfer,
            )}
            {tokenInfo &&
              tokenInfo.stakingEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.THREE_D_CUBE}
                  theme={theme}
                  width={18}
                  height={18}
                />,
                translate('wallet.operations.token_stake.title'),
                onGoToStake,
              )}
            {tokenInfo.stakingEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.THREE_D_CUBE_ROTATE}
                  theme={theme}
                  {...styles.buttonIcon}
                />,
                translate('wallet.operations.token_unstake.title'),
                onGoToUnstake,
              )}
            {tokenInfo.delegationEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.DELEGATE_VESTING_SHARES}
                  theme={theme}
                  {...styles.buttonIcon}
                />,
                translate('wallet.operations.token_delegation.title'),
                onGoToDelegate,
              )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({
  width,
  height,
  color,
  change,
  theme,
}: ScaledSize & {color: string; change: string; theme: Theme}) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColor,
      borderRadius: 20,
      width: '100%',
      backgroundColor: getColors(theme).secondaryCardBgColor,
      paddingHorizontal: width * 0.05,
      paddingVertical: width * 0.03,
    },
    logo: {justifyContent: 'center', alignItems: 'center'},
    flexRowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    flexRowAligned: {flexDirection: 'row', alignItems: 'center'},
    flexColumnCentered: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    containerMarginLeft: {
      marginLeft: 7,
    },
    textSymbol: {
      ...button_link_primary_medium,
      lineHeight: 22,
      color: getColors(theme).symbolText,
      fontSize: getFontSizeSmallDevices(
        height,
        button_link_primary_medium.fontSize,
      ),
    },
    textAmount: {
      color: getColors(theme).totalDisplayTextAmount,
      lineHeight: 17,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
        button_link_primary_medium.fontSize,
      ),
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 14,
      marginBottom: 9,
    },
    innerButtonContainer: {flexDirection: 'row', alignItems: 'center'},
    iconButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: BORDERWHITISH,
      marginRight: BUTTON_ICON_TEXT_MARGIN,
    },
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      width: '38%',
      height: 65,
      justifyContent: 'center',
      margin: BUTTON_MARGIN_BETWEEN,
    },
    expandedItemContainer: {
      marginTop: 10,
    },
    textBodyItem: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      fontSize: 12,
      opacity: 0.7,
      lineHeight: 14.7,
    },
    textButton: {
      ...title_secondary_body_3,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(height, 14),
      letterSpacing: -0.4,
    },
    invertXAxis: {
      transform: [{rotateY: '180deg'}],
    },
    historyButton: {
      width: 40,
      height: 40,
    },
    buttonIcon: {
      width: 20,
      height: 20,
    },
  });

export default TokenDisplay;
