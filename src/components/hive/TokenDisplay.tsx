import {Currency, Token} from 'actions/interfaces';
import {DelegateTokenOperationProps} from 'components/operations/DelegateToken';
import DelegationsList from 'components/operations/DelegationsList';
import IncomingOutGoingTokenDelegations from 'components/operations/IncomingOutGoingTokenDelegations';
import RoundButton from 'components/operations/OperationsButtons';
import {StakeTokenOperationProps} from 'components/operations/StakeToken';
import {UnstakeTokenOperationProps} from 'components/operations/UnstakeToken';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {
  Linking,
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {TokenBalance} from 'src/interfaces/tokens.interface';
import {BORDERWHITISH, getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  button_link_primary_medium,
  fields_primary_text_2,
  getFontSizeSmallDevices,
  title_secondary_body_3,
} from 'src/styles/typography';
import {formatBalance, signedNumber} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Icon from './Icon';

type Props = {
  name: string;
  logo: JSX.Element;
  currency: string;
  value: number;
  totalValue: number;
  secondaryCurrency?: string;
  secondaryValue?: number;
  color: string;
  price?: Currency;
  incoming?: number;
  outgoing?: number;
  buttons: JSX.Element[];
  amountStyle?: StyleProp<TextStyle>;
  bottomLeft?: JSX.Element;
  toggled: boolean;
  setToggle: () => void;
  //TODO fixed after refactoring UI
  using_new_ui?: boolean;
  renderButtonOptions?: boolean;
  theme: Theme;
  tokenInfo?: Token;
  tokenBalance?: TokenBalance;
};

const TokenDisplay = ({
  name,
  logo,
  currency,
  value,
  buttons,
  color,
  price,
  incoming,
  outgoing,
  amountStyle,
  secondaryCurrency,
  secondaryValue,
  bottomLeft,
  toggled,
  setToggle,
  using_new_ui,
  renderButtonOptions,
  theme,
  tokenInfo,
  totalValue,
  tokenBalance,
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
      additionalButtonStyle={styles.squareButton}
    />
  );

  return using_new_ui ? (
    <View style={styles.container}>
      <View style={styles.flexRowBetween}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.logo}>{logo}</View>
          <View style={[styles.flexColumnCentered, styles.containerMarginLeft]}>
            <Text style={styles.textSymbol}>{name}</Text>
            <Text style={styles.textAmount}>
              {value ? formatBalance(value) : 0}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {renderButtonOptions && buttons}
          <Icon
            name={'expand_more'}
            theme={theme}
            onClick={() => setToggle()}
            additionalContainerStyle={styles.expandMoreButton}
            width={12}
            height={12}
          />
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
                name="logout"
                theme={theme}
                width={15}
                height={15}
                additionalContainerStyle={[
                  styles.containerMarginLeft,
                  styles.invertXAxis,
                ]}
                onClick={() =>
                  navigate('TemplateStack', {
                    titleScreen: 'Incoming',
                    component: (
                      <IncomingOutGoingTokenDelegations
                        delegationType="incoming"
                        total={tokenBalance.delegationsIn}
                        token={tokenBalance}
                        tokenLogo={logo}
                        tokenInfo={tokenInfo}
                      />
                    ),
                  } as TemplateStackProps)
                }
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
                name="logout"
                theme={theme}
                width={15}
                height={15}
                additionalContainerStyle={styles.containerMarginLeft}
                onClick={() =>
                  navigate('TemplateStack', {
                    titleScreen: 'Outgoing',
                    component: (
                      <IncomingOutGoingTokenDelegations
                        delegationType="outgoing"
                        total={tokenBalance.delegationsOut}
                        token={tokenBalance}
                        tokenLogo={logo}
                        tokenInfo={tokenInfo}
                      />
                    ),
                  } as TemplateStackProps)
                }
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
          {tokenInfo && (
            <View style={styles.buttonsContainer}>
              {tokenInfo.stakingEnabled &&
                renderAsSquareButton(
                  <Icon name="3d_cube" theme={theme} width={10} height={10} />,
                  translate('wallet.operations.token_stake.title'),
                  () =>
                    navigate('Operation', {
                      operation: 'stake',
                      props: {
                        currency: currency,
                        balance: tokenBalance.balance,
                        tokenLogo: logo,
                      } as StakeTokenOperationProps,
                    }),
                )}
              {tokenInfo.stakingEnabled &&
                renderAsSquareButton(
                  <Icon
                    name="3d_cube_rotate"
                    theme={theme}
                    width={12}
                    height={12}
                  />,
                  translate('wallet.operations.token_unstake.title'),
                  () =>
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
                    }),
                )}
              {tokenInfo.delegationEnabled &&
                renderAsSquareButton(
                  <Icon
                    name="delegate_vesting_shares"
                    theme={theme}
                    width={10}
                    height={10}
                  />,
                  translate('wallet.operations.token_delegation.title'),
                  () =>
                    navigate('Operation', {
                      operation: 'delegate',
                      props: {
                        currency: currency,
                        balance: tokenBalance.stake,
                        tokenLogo: logo,
                      } as DelegateTokenOperationProps,
                    }),
                )}
            </View>
          )}
        </View>
      )}
    </View>
  ) : (
    //TODO OLD UI to remove
    <TouchableOpacity style={styles.container} onPress={setToggle}>
      <View style={styles.main}>
        <View style={styles.left}>
          <View style={styles.logo}>{logo}</View>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View>
          <Text style={amountStyle || styles.amount}>
            {value ? formatBalance(value) : 0}
            <Text style={styles.currency}>{` ${currency}`}</Text>
          </Text>
          {secondaryCurrency ? (
            <Text style={amountStyle || styles.amount}>
              {secondaryValue ? formatBalance(secondaryValue) : 0}
              <Text style={styles.currency}>{` ${secondaryCurrency}`}</Text>
            </Text>
          ) : null}
        </View>
      </View>
      {toggled && (
        <View style={[styles.row, styles.toggle]}>
          {bottomLeft
            ? bottomLeft
            : renderLeftBottom(
                styles,
                price,
                currency,
                theme,
                incoming,
                outgoing,
              )}
          <View
            style={[
              styles.row,
              currency !== 'HIVE' ? styles.halfLine : styles.sixtyPercentLine,
              styles.rowReverse,
            ]}>
            {buttons}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
  //END Old UI
};

const renderLeftBottom = (
  styles: Styles,
  price: Currency,
  currency: string,
  theme: Theme,
  incoming?: number,
  outgoing?: number,
) => {
  if (currency !== 'HP') {
    return (
      <View style={[styles.row, styles.flex]}>
        <Text style={styles.price}>{`$ ${price.usd?.toFixed(2)}`}</Text>
        <Text style={styles.change}>{`${signedNumber(
          +price.usd_24h_change!.toFixed(2),
        )}%`}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.flex}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('ModalScreen', {
                modalContent: <DelegationsList theme={theme} type="incoming" />,
              });
            }}>
            <Text style={styles.green}>{`+ ${formatBalance(
              incoming!,
            )} HP`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              navigate('ModalScreen', {
                modalContent: <DelegationsList theme={theme} type="outgoing" />,
              });
            }}>
            <Text style={styles.red}>{`- ${formatBalance(outgoing!)} HP`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const getDimensionedStyles = ({
  width,
  height,
  color,
  change,
  theme,
}: ScaledSize & {color: string; change: string; theme: Theme}) =>
  StyleSheet.create({
    //TODO after refactoring, update, cleanup
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
    main: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    logo: {justifyContent: 'center', alignItems: 'center'},
    name: {
      marginLeft: width * 0.03,
      fontSize: 15,
      color: '#7E8C9A',
    },
    amount: {fontWeight: 'bold', fontSize: 17, textAlign: 'right'},
    currency: {color},
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggle: {
      marginTop: width * 0.03,
    },
    price: {fontSize: 15, color: '#7E8C9A', fontWeight: 'bold'},
    change: {color: +change > 0 ? '#3BB26E' : '#B9122F'},
    green: {color: '#3BB26E'},
    red: {color: '#B9122F'},
    halfLine: {width: '50%'},
    sixtyPercentLine: {width: '60%'},
    rowReverse: {flexDirection: 'row-reverse'},
    flex: {flex: 1, marginRight: 30},
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
    expandMoreButton: {
      width: 28,
      height: 20,
      backgroundColor: theme === Theme.LIGHT ? '#F1F1F1' : null,
      borderRadius: 11,
      alignItems: 'center',
      marginLeft: 7,
      borderColor: theme === Theme.DARK ? '#364360' : null,
      borderWidth: theme === Theme.DARK ? 1 : 0,
    },
    textSymbol: {
      ...button_link_primary_medium,
      lineHeight: 22,
      //TODO same as bellow todo
      color: getColors(theme).tertiaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        button_link_primary_medium.fontSize,
      ),
    },
    textAmount: {
      //TODO name this bellow as totalDisplayTextAmount
      color: getColors(theme).quaternaryText,
      lineHeight: 17,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
        button_link_primary_medium.fontSize,
      ),
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
      marginBottom: 9,
    },
    innerButtonContainer: {flexDirection: 'row', alignItems: 'center'},
    iconButton: {
      width: 12,
      height: 12,
    },
    iconButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      borderWidth: 1,
      borderColor: BORDERWHITISH,
      padding: 4,
      marginRight: 3,
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 6,
      padding: 6,
    },
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      width: '30%',
      height: 'auto',
      paddingHorizontal: 22,
      paddingVertical: 15,
    },
    expandedItemContainer: {
      marginTop: 10,
    },
    textBodyItem: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      opacity: 0.7,
      lineHeight: 14.7,
    },
    textButton: {
      ...title_secondary_body_3,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        title_secondary_body_3.fontSize,
      ),
      letterSpacing: -0.4,
    },
    invertXAxis: {
      transform: [{rotateY: '180deg'}],
    },
  });
type Styles = ReturnType<typeof getDimensionedStyles>;

export default TokenDisplay;
