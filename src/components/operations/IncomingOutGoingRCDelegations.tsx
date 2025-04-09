import {loadAccount} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import Separator from 'components/ui/Separator';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  RCDelegationValue,
  RcDelegation,
} from 'src/interfaces/rc-delegation.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {formatBalance} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';
import IncomingOutgoingRcDelegationItem from './IncomingOutgoingRcDelegationItem';
import OperationThemed from './OperationThemed';

interface Props {
  type: 'incoming' | 'outgoing';
  total: RCDelegationValue;
  available: RCDelegationValue;
}

const IncomingOutGoingRCDelegations = ({
  type,
  user,
  loadAccount,
  total,
  available,
}: Props & PropsFromRedux) => {
  const [rcDelegations, setRcDelegations] = useState<RcDelegation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const [isMultisig, twoFABots] = useCheckForMultisig(KeyTypes.posting, user);
  const styles = getStyles(theme, width);

  useEffect(() => {
    init();
  }, [user.name!]);

  const init = async () => {
    if (type === 'outgoing') {
      const delegations = await RcDelegationsUtils.getAllOutgoingDelegations(
        user.name,
      );
      setRcDelegations(delegations);
    }
  };

  const renderListItem = (rcDelegation: RcDelegation) => {
    return (
      <IncomingOutgoingRcDelegationItem
        theme={theme}
        type={type}
        item={rcDelegation}
        available={available}
        isMultisig={isMultisig}
        twoFABots={twoFABots}
      />
    );
  };

  return (
    <OperationThemed
      childrenTop={<Separator />}
      childrenMiddle={
        <View style={{justifyContent: 'flex-start'}}>
          <Separator height={30} />
          <View
            style={[
              styles.flexRowBetween,
              getCardStyle(theme).defaultCardItem,
            ]}>
            <Text style={styles.title}>
              {translate(`wallet.operations.rc_delegation.total_${type}`)}
            </Text>
            <View style={styles.title}>
              <Text style={styles.title}>
                {RcDelegationsUtils.formatRcWithUnit(total.gigaRcValue, true)}
              </Text>
              <Text style={styles.italicText}>
                ≈{formatBalance(+total.hpValue)} {getCurrency('HP')}
              </Text>
            </View>
          </View>
          <Separator
            drawLine
            height={10}
            additionalLineStyle={styles.bottomLine}
          />
          {!isLoading && rcDelegations.length > 0 && (
            <FlatList
              data={rcDelegations}
              renderItem={(rcDelegation) => renderListItem(rcDelegation.item)}
              keyExtractor={(rcDelegation) =>
                `${rcDelegation.value}-${rcDelegation.delegatee}`
              }
            />
          )}
        </View>
      }
    />
  );
};
const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      flexDirection: 'column',
      fontSize: getFontSizeSmallDevices(width, 15),
      textAlign: 'right',
    },
    opaque: {opacity: 0.6},
    italicText: {
      fontFamily: FontPoppinsName.ITALIC,
      textAlign: 'right',
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 14),
    },
    bottomLine: {
      borderColor: getColors(theme).lineSeparatorStroke,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomingOutGoingRCDelegations);
