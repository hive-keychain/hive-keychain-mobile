import {loadAccount} from 'actions/index';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RCDelegationValue} from 'src/interfaces/rc-delegation.interface';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  FontJosefineSansName,
  FontPoppinsName,
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';
import OperationThemed from './OperationThemed';

export interface RCDelegationOperationProps {
  //TODO fill bellow
}

const DEFAULT_VALUE: RCDelegationValue = {
  hpValue: '...',
  gigaRcValue: '...',
};

const RCDelegation = ({
  loadAccount,
  properties,
  user,
}: RCDelegationOperationProps & PropsFromRedux) => {
  const [totalIncoming, setTotalIncoming] = useState<RCDelegationValue>(
    DEFAULT_VALUE,
  );
  const [totalOutgoing, setTotalOutgoing] = useState<RCDelegationValue>(
    DEFAULT_VALUE,
  );
  const [available, setAvailable] = useState<RCDelegationValue>(DEFAULT_VALUE);
  const [amount, setAmount] = useState('');
  const [equivalentHPAmount, setEquivalentHPAmount] = useState<
    string | undefined
  >();
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  //TODO keep working here:
  //  - add incomming + operations
  //  - add outgoing + operations
  //  - add buttonRenderComponent to set amounts.
  //  - add onDelegate
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (amount.trim().length > 0 && parseFloat(amount) > 0) {
      setEquivalentHPAmount(
        withCommas(RcDelegationsUtils.gigaRcToHp(amount, properties)),
      );
    } else setEquivalentHPAmount(undefined);
  }, [amount]);

  const init = async () => {
    console.log({rc: user.rc}); //TODO remove line
    setTotalIncoming({
      hpValue: RcDelegationsUtils.rcToHp(
        user.rc.received_delegated_rc.toString(),
        properties,
      ),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(user.rc.received_delegated_rc),
    });
    setTotalOutgoing({
      hpValue: RcDelegationsUtils.rcToHp(
        user.rc.delegated_rc.toString(),
        properties,
      ),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(user.rc.delegated_rc),
    });
    const availableRc = (user.rc.max_rc * user.rc.percentage) / 100;

    setAvailable({
      hpValue: RcDelegationsUtils.rcToHp(availableRc.toString(), properties),
      gigaRcValue: RcDelegationsUtils.rcToGigaRc(availableRc),
    });
  };

  const onHandleNavigateToRCDelegations = (type: 'incoming' | 'outgoing') => {
    //TODO
  };

  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <CurrentAvailableBalance
            theme={theme}
            currentValue={`+${RcDelegationsUtils.formatRcWithUnit(
              totalIncoming.gigaRcValue,
              true,
            )}`}
            availableValue={`-${RcDelegationsUtils.formatRcWithUnit(
              totalOutgoing.gigaRcValue,
              true,
            )}`}
            additionalContainerStyle={styles.currentAvailableBalances}
            setMaxAvailable={(value) => {}}
            leftLabelTranslationKey="wallet.operations.rc_delegation.total_incoming"
            rightLabelTranslationKey="wallet.operations.rc_delegation.total_outgoing"
            onleftClick={() => onHandleNavigateToRCDelegations('incoming')}
            onRightClick={() => onHandleNavigateToRCDelegations('outgoing')}
          />
          <Separator />
          <TouchableOpacity
            onPress={() => setAmount(available.gigaRcValue)}
            style={[
              getCardStyle(theme, 30).defaultCardItem,
              styles.marginPadding,
            ]}>
            <View>
              <Text
                style={[styles.textBase, styles.josefineFont, styles.opaque]}>
                {capitalize(translate(`common.available`))}
              </Text>
              <Text
                style={[styles.textBase, styles.title, styles.josefineFont]}>
                {`${withCommas(available.gigaRcValue)} ${translate(
                  'wallet.operations.rc_delegation.giga_rc',
                )}`}
              </Text>
            </View>
          </TouchableOpacity>
          <Separator />
        </>
      }
      childrenMiddle={
        <>
          <Separator height={30} />
          <Text style={[styles.textBase, styles.opaque, styles.disclaimer]}>
            {translate('wallet.operations.rc_delegation.disclaimer')}
          </Text>
          <Separator />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name="at" />}
            inputStyle={[styles.textBase, styles.paddingLeft]}
            value={to}
            onChangeText={(e) => {
              setTo(e.trim());
            }}
          />
          <Separator />
          <View style={styles.flexRow}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={translate('wallet.operations.rc_delegation.giga_rc')}
              value={translate('wallet.operations.rc_delegation.giga_rc')}
              editable={false}
              additionalOuterContainerStyle={{
                width: '40%',
              }}
              inputStyle={styles.textBase}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
            />
            <OperationInput
              labelInput={capitalize(translate('common.amount'))}
              labelBottomExtraInfo={
                equivalentHPAmount
                  ? `(≈ ${equivalentHPAmount} ${getCurrency('HP')})`
                  : undefined
              }
              placeholder={'0.000'}
              keyboardType="decimal-pad"
              textAlign="right"
              value={amount}
              inputStyle={[styles.textBase, styles.paddingLeft]}
              additionalBottomLabelTextStyle={[
                styles.textBase,
                styles.italic,
                styles.redText,
              ]}
              onChangeText={setAmount}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity
                    //TODO bellow
                    onPress={() => {}}>
                    <Text style={[styles.textBase, styles.redText]}>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </>
      }
      childrenBottom={
        <>
          <ActiveOperationButton
            title={translate(
              'wallet.operations.rc_delegation.delegate_to_user',
            )}
            //TODO bellow
            onPress={() => {}}
            style={[getButtonStyle(theme).warningStyleButton]}
            isLoading={loading}
            additionalTextStyle={{...button_link_primary_medium}}
          />
          <Separator />
        </>
      }
    />
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    marginPadding: {marginHorizontal: 15, paddingVertical: 10},
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    opaque: {
      opacity: 0.7,
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    title: {
      fontSize: 15,
    },
    disclaimer: {
      fontSize: 14,
      paddingHorizontal: 8,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    paddingLeft: {
      paddingLeft: 10,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    flexRow: {flexDirection: 'row', justifyContent: 'space-between'},
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

export default connector(RCDelegation);
