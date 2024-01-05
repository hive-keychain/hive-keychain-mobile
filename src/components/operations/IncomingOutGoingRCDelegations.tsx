import {loadAccount} from 'actions/index';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  RCDelegationValue,
  RcDelegation,
} from 'src/interfaces/rc-delegation.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {FontPoppinsName, title_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format';
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
  const styles = getStyles(theme);

  useEffect(() => {
    init();
  }, [user.name!]);

  const init = async () => {
    if (type === 'outgoing') {
      const delegations = await RcDelegationsUtils.getAllOutgoingDelegations(
        user.name,
      );
      console.log({delegations});
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
      />
    );
  };

  return (
    <OperationThemed
      childrenTop={<Separator />}
      childrenMiddle={
        <>
          <Separator height={30} />
          <View
            style={[
              styles.flexRowBetween,
              getCardStyle(theme).defaultCardItem,
            ]}>
            <Text style={styles.title}>
              {translate('common.total')} {capitalize(type)}
            </Text>
            <Text style={styles.title}>
              {total.gigaRcValue}{' '}
              {translate('wallet.operations.rc_delegation.giga_rc')}
              <Text style={styles.italicText}>
                (≈{total.hpValue} {getCurrency('HP')})
              </Text>
            </Text>
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
        </>
      }
    />
  );
};
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      fontSize: 15,
    },
    opaque: {opacity: 0.6},
    italicText: {
      fontFamily: FontPoppinsName.ITALIC,
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
