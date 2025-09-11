import {loadAccount} from 'actions/index';
import {KeyTypes, TokenBalance} from 'actions/interfaces';
import {showModal} from 'actions/message';
import {Caption} from 'components/ui/Caption';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Token} from 'src/interfaces/tokens.interface';
import {getCurrencyProperties} from 'src/lists/hiveReact.list';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format.utils';
import {
  TokenDelegation,
  getIncomingTokenDelegations,
  getOutgoingTokenDelegations,
} from 'utils/hiveEngine.utils';
import {translate} from 'utils/localize';
import IncomingOutGoingTokenDelegationItem from './IncomingOutgoingTokenDelegationItem';
import OperationThemed from './OperationThemed';

export type TokenDelegationType = 'Outgoing' | 'Incoming';

type Props = PropsFromRedux & {
  delegationType: TokenDelegationType;
  total: string;
  token: TokenBalance;
  tokenLogo: React.ReactNode;
  tokenInfo: Token;
  gobackAction?: () => void;
};

const IncomingOutGoingTokenDelegations = ({
  delegationType,
  total,
  token,
  tokenLogo,
  user,
  tokenInfo,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [delegationList, setDelegationList] = useState<TokenDelegation[]>([]);
  const [isMultisig, twoFABots] = useCheckForMultisig(KeyTypes.active, user);
  const {width} = useWindowDimensions();

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const init = async () => {
    let delegations: TokenDelegation[];

    if (delegationType === 'Incoming') {
      delegations = await getIncomingTokenDelegations(user.name!, token.symbol);
    } else {
      delegations = await getOutgoingTokenDelegations(user.name!, token.symbol);
    }

    setDelegationList(delegations);
    setLoading(false);
  };

  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(token.symbol);
  const styles = getDimensionedStyles(color, theme, width);

  const renderListItem = useCallback(
    ({item}: {item: TokenDelegation}) => (
      <IncomingOutGoingTokenDelegationItem
        tokenDelegation={item}
        delegationType={delegationType}
        tokenLogo={tokenLogo}
        token={token}
        tokenInfo={tokenInfo}
        theme={theme}
        isMultisig={isMultisig}
        twoFABots={twoFABots}
      />
    ),
    [
      delegationType,
      tokenLogo,
      token,
      tokenInfo,
      theme,
      isMultisig,
      twoFABots,
      user,
    ],
  );

  return (
    <OperationThemed
      childrenTop={<Separator />}
      childrenMiddle={
        <View style={{flex: 1}}>
          {delegationType === 'Outgoing' && (
            <>
              <Caption
                text="wallet.operations.token_delegation.undelegation_cooldown_disclaimer"
                textParams={{
                  symbol: token.symbol,
                  undelegationCooldown: tokenInfo.undelegationCooldown,
                }}
              />
              {parseFloat(token.pendingUndelegations) > 0 && (
                <>
                  <Separator />
                  <View style={styles.flexRowBetween}>
                    <Text style={styles.title}>
                      {translate(
                        'wallet.operations.token_delegation.token_pending_undelegation',
                      )}
                    </Text>
                    <Text style={styles.title}>
                      {token.pendingUndelegations} {token.symbol}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
          <Separator />
          <View style={styles.flexRowBetween}>
            <Text style={styles.title}>{capitalize(delegationType)}</Text>
            <Text style={styles.title}>
              {total} {token.symbol}
            </Text>
          </View>

          {loading && (
            <View style={styles.flex}>
              <Loader animating={true} />
            </View>
          )}
          <Separator />
          {!loading && delegationList.length > 0 && (
            <ScrollView
              horizontal={true}
              contentContainerStyle={{width: '100%', height: '100%'}}>
              <FlatList
                data={delegationList}
                renderItem={renderListItem}
                keyExtractor={(tokenDelegation) =>
                  tokenDelegation.created.toString()
                }
              />
            </ScrollView>
          )}
        </View>
      }
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme, width: number) =>
  StyleSheet.create({
    currency: {
      fontWeight: 'bold',
      fontSize: getFontSizeSmallDevices(width, 15),
      color,
    },
    flex: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexRowBetween: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    infoText: {
      color: getColors(theme).septenaryText,
      opacity: theme === Theme.DARK ? 0.6 : 1,
      ...title_primary_title_1,
      paddingHorizontal: 5,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomingOutGoingTokenDelegations);
