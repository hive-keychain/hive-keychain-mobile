import {Currency} from 'actions/interfaces';
import {DelegateTokenOperationProps} from 'components/operations/DelegateToken';
import IncomingOutGoingTokenDelegations from 'components/operations/IncomingOutGoingTokenDelegations';
import {StakeTokenOperationProps} from 'components/operations/StakeToken';
import {TransferOperationProps} from 'components/operations/Transfer';
import {UnstakeTokenOperationProps} from 'components/operations/UnstakeToken';
import Separator from 'components/ui/Separator';
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
import {Token, TokenBalance} from 'src/interfaces/tokens.interface';
import {
  BUTTON_ICON_TEXT_MARGIN,
  BUTTON_MARGIN_BETWEEN,
  MAIN_PAGE_ACTION_BUTTONS_WIDTH,
} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
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
  balance: number;
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
  balance: value,
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
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.squareButton, additionalButtonStyle]}>
      <View style={[styles.innerButtonContainer]}>
        {icon}
        <Text style={[styles.textButton]}>{label}</Text>
      </View>
    </TouchableOpacity>
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

  const handleToogle = () => {
    setToggle();
  };

  const bottomLine = () => (
    <Separator drawLine height={0.5} additionalLineStyle={styles.bottomLine} />
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleToogle}
      style={styles.container}>
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
              onPress={onHandleGoToTokenHistory}
              additionalContainerStyle={[
                styles.squareButton,
                styles.containerMarginLeft,
                styles.historyButton,
              ]}
              theme={theme}
              color={PRIMARY_RED_COLOR}
            />
          )}
        </View>
      </View>
      {toggled && (
        <View style={styles.expandedItemContainer}>
          {tokenInfo && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                Linking.openURL(`https://peakd.com/@${tokenInfo.issuer}`)
              }>
              <View style={styles.tokenInformationRow}>
                <Text style={styles.textBodyItem}>
                  {translate('wallet.operations.tokens.issuer') + ' '}
                </Text>
                <Text style={styles.textBodyItem}>@{tokenInfo.issuer}</Text>
              </View>
            </TouchableOpacity>
          )}
          <View>
            {bottomLine()}
            <View style={styles.tokenInformationRow}>
              <Text style={styles.textBodyItem}>
                {translate('wallet.operations.tokens.total_value')}
              </Text>
              <Text style={styles.textBodyItem}>
                ${tokenTotalValue} (${price.usd}/
                {translate('common.token').toLowerCase()})
              </Text>
            </View>
          </View>

          <View>
            {bottomLine()}
            <View style={styles.tokenInformationRow}>
              <Text style={styles.textBodyItem}>
                {translate('wallet.operations.tokens.liquid_balance')}
              </Text>
              <Text style={styles.textBodyItem}>
                {value ? formatBalance(value) : 0}
              </Text>
            </View>
          </View>

          {tokenBalance && parseFloat(tokenBalance.delegationsIn) > 0 && (
            <TouchableOpacity activeOpacity={1} onPress={onGoToIncoming}>
              {bottomLine()}
              <View
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}>
                <View style={[styles.tokenInformationRow]}>
                  <Text style={styles.textBodyItem}>
                    {translate('wallet.operations.tokens.incoming')}
                  </Text>
                  <Text style={styles.textBodyItem}>
                    {formatBalance(parseFloat(tokenBalance.delegationsIn))}
                  </Text>
                </View>
                <Icon
                  name={Icons.LOGOUT}
                  theme={theme}
                  width={15}
                  height={15}
                  additionalContainerStyle={[
                    styles.containerMarginLeft,
                    styles.invertXAxis,
                  ]}
                  onPress={onGoToIncoming}
                  color={PRIMARY_RED_COLOR}
                />
              </View>
            </TouchableOpacity>
          )}
          {tokenBalance && parseFloat(tokenBalance.delegationsOut) > 0 && (
            <TouchableOpacity activeOpacity={1} onPress={onGoToOutgoing}>
              {bottomLine()}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={styles.tokenInformationRow}>
                  <Text style={styles.textBodyItem}>
                    {translate('wallet.operations.tokens.outgoing')}
                  </Text>
                  <Text style={styles.textBodyItem}>
                    {formatBalance(parseFloat(tokenBalance.delegationsOut))}
                  </Text>
                </View>
                <Icon
                  name={Icons.LOGOUT}
                  theme={theme}
                  width={15}
                  height={15}
                  additionalContainerStyle={[styles.containerMarginLeft]}
                  onPress={onGoToOutgoing}
                  color={PRIMARY_RED_COLOR}
                />
              </View>
            </TouchableOpacity>
          )}
          {tokenInfo && tokenInfo.stakingEnabled && tokenBalance.stake && (
            <View>
              {bottomLine()}
              <View style={styles.tokenInformationRow}>
                <Text style={styles.textBodyItem}>
                  {translate('wallet.operations.tokens.total_staked')}
                </Text>
                <Text style={styles.textBodyItem}>
                  {' '}
                  {formatBalance(parseFloat(tokenBalance.stake))}
                </Text>
              </View>
            </View>
          )}
          {tokenInfo &&
            tokenInfo.stakingEnabled &&
            tokenBalance.pendingUnstake &&
            parseFloat(tokenBalance.pendingUnstake) > 0 && (
              <View>
                {bottomLine()}
                <View style={styles.tokenInformationRow}>
                  <Text style={styles.textBodyItem}>
                    {translate('wallet.operations.tokens.pending_unstake')}
                  </Text>
                  <Text style={styles.textBodyItem}>
                    {formatBalance(parseFloat(tokenBalance.pendingUnstake))}
                  </Text>
                </View>
              </View>
            )}
          <View style={styles.buttonsContainer}>
            {renderAsSquareButton(
              <Icon
                theme={theme}
                name={Icons.TRANSFER}
                {...styles.buttonIcon}
                additionalContainerStyle={[styles.marginRight]}
                color={PRIMARY_RED_COLOR}
              />,
              translate('common.send'),
              onTransfer,
            )}
            {tokenInfo &&
              tokenInfo.stakingEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.STAKE}
                  theme={theme}
                  {...styles.buttonIcon}
                  additionalContainerStyle={styles.marginRight}
                  color={PRIMARY_RED_COLOR}
                />,
                translate('wallet.operations.token_stake.title'),
                onGoToStake,
              )}
            {tokenInfo.stakingEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.UNSTAKE}
                  theme={theme}
                  width={28}
                  height={28}
                  additionalContainerStyle={styles.marginRight}
                  color={PRIMARY_RED_COLOR}
                />,
                translate('wallet.operations.token_unstake.title'),
                onGoToUnstake,
              )}
            {tokenInfo.delegationEnabled &&
              renderAsSquareButton(
                <Icon
                  name={Icons.DELEGATE_TOKEN}
                  theme={theme}
                  {...styles.buttonIcon}
                  additionalContainerStyle={styles.marginRight}
                  color={PRIMARY_RED_COLOR}
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
        width,
        button_link_primary_medium.fontSize,
      ),
    },
    textAmount: {
      color: getColors(theme).totalDisplayTextAmount,
      lineHeight: 17,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        width,
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
    innerButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      width: MAIN_PAGE_ACTION_BUTTONS_WIDTH,
      height: 65,
      justifyContent: 'center',
      margin: BUTTON_MARGIN_BETWEEN,
    },
    expandedItemContainer: {
      paddingVertical: 8,
    },
    textBodyItem: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      fontSize: 12,
      opacity: 0.7,
    },
    textButton: {
      ...title_secondary_body_3,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(width, 15),
      paddingTop: 4,
      lineHeight: 15,
    },
    invertXAxis: {
      transform: [{rotateY: '180deg'}],
    },
    historyButton: {
      width: 38,
      height: 38,
    },
    buttonIcon: {
      width: 20,
      height: 20,
    },
    marginRight: {
      marginRight: BUTTON_ICON_TEXT_MARGIN,
    },
    bottomLine: {
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
      marginVertical: 4,
    },
    displayItemContainer: {
      width: '95%',
    },
    tokenInformationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '95%',
      marginVertical: 4,
    },
  });

export default TokenDisplay;
