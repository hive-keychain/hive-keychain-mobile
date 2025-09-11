import {loadAccount} from 'actions/index';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import TwoFaModal from 'components/modals/TwoFaModal';
import ConfirmationInItem from 'components/ui/ConfirmationInItem';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {
  RCDelegationValue,
  RcDelegation,
} from 'src/interfaces/rcDelegation.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle, getSeparatorLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontPoppinsName,
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, getCleanAmountValue, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {RcDelegationsUtils} from 'utils/rc-delegations.utils';

interface Props {
  theme: Theme;
  type: 'incoming' | 'outgoing';
  item: RcDelegation;
  available: RCDelegationValue;
  isMultisig: boolean;
  twoFABots: {[botName: string]: string};
}

const IncomingOutgoingRcDelegationItem = ({
  theme,
  type,
  item,
  properties,
  available,
  user,
  loadAccount,
  isMultisig,
  twoFABots,
}: Props & PropsFromRedux) => {
  const [selectedItem, setSelectedItem] = useState<RcDelegation>();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedAmountDelegation, setEditedAmountDelegation] = useState('');
  const [
    showCancelConfirmationRCDelegation,
    setShowCancelConfirmationRCDelegation,
  ] = useState(false);
  const [equivalentHPAmount, setEquivalentHPAmount] = useState<
    string | undefined
  >();

  const {width} = useWindowDimensions();

  const styles = getStyles(theme, width);

  const onHandleSelectedItem = (item: RcDelegation) => {
    setSelectedItem(selectedItem ? undefined : item);
    setEditedAmountDelegation(
      selectedItem
        ? ''
        : RcDelegationsUtils.rcToGigaRc(Number(item.value)).toString(),
    );
  };

  useEffect(() => {
    if (
      editedAmountDelegation.trim().length > 0 &&
      parseFloat(editedAmountDelegation) > 0
    ) {
      setEquivalentHPAmount(
        withCommas(
          RcDelegationsUtils.gigaRcToHp(editedAmountDelegation, properties),
        ),
      );
    } else {
      setEquivalentHPAmount(undefined);
    }
  }, [editedAmountDelegation]);

  const hpValue = RcDelegationsUtils.gigaRcToHp(
    RcDelegationsUtils.rcToGigaRc(Number(item.value)),
    properties,
  );

  const isItemSelected =
    selectedItem && selectedItem.delegatee === item.delegatee;

  const onRCDelegate = async (isCancelling?: boolean) => {
    let amount = isCancelling ? '0.000' : editedAmountDelegation;
    const isCancel = Number(amount) === 0;
    const handleSubmit = async (options: TransactionOptions) => {
      try {
        setIsLoading(true);
        let success: any;

        success = await RcDelegationsUtils.sendDelegation(
          RcDelegationsUtils.gigaRcToRc(parseFloat(amount)),
          item.delegatee,
          user.name!,
          user.keys.posting!,
          options,
        );
        if (success) {
          loadAccount(user.name!);
          goBack();
          if (!isMultisig) {
            if (!isCancel) {
              SimpleToast.show(
                translate(
                  'wallet.operations.rc_delegation.success.rc_delegation_successful',
                  {to: item.delegatee},
                ),
                {
                  duration: SimpleToast.durations.LONG,
                },
              );
            } else {
              SimpleToast.show(
                translate(
                  'wallet.operations.rc_delegation.success.cancel_rc_delegation_successful',
                  {to: item.delegatee},
                ),
                {
                  duration: SimpleToast.durations.LONG,
                },
              );
            }
          }
        } else {
          if (!isMultisig)
            SimpleToast.show(
              translate(
                'wallet.operations.rc_delegation.failed.rc_delegation_failed',
              ),
              {
                duration: SimpleToast.durations.LONG,
              },
            );
        }
      } catch (error) {
        SimpleToast.show(`Error : ${(error as any).message}`, {
          duration: SimpleToast.durations.LONG,
        });
      } finally {
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
      handleSubmit({
        multisig: isMultisig,
        fromWallet: true,
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[getCardStyle(theme, 28).defaultCardItem]}
      onPress={() => onHandleSelectedItem(item)}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.textBase}> {`@${item.delegatee}`}</Text>
        </View>
        <View style={styles.rightContainer}>
          <View>
            <Text style={styles.textBase}>
              {RcDelegationsUtils.formatRcWithUnit(item.value)}
            </Text>
            <Text style={[styles.textBase, styles.italic, styles.opaque]}>
              {`(≈ ${hpValue}) ${getCurrency('HP')}`}
            </Text>
          </View>
          <Icon
            theme={theme}
            name={Icons.EXPAND_THIN}
            additionalContainerStyle={[
              styles.logo,
              getRotateStyle(
                selectedItem && selectedItem.delegatee === item.delegatee
                  ? '0'
                  : '180',
              ),
            ]}
            {...styles.smallIcon}
          />
        </View>
      </View>
      {!showCancelConfirmationRCDelegation && isItemSelected && !editMode && (
        <>
          <Separator
            drawLine
            additionalLineStyle={[
              getSeparatorLineStyle(theme, 0.5).itemLine,
              styles.margins,
            ]}
          />
          <View style={styles.buttonRowContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.button, styles.marginRight]}
              onPress={() => setEditMode(true)}>
              <Icon
                name={Icons.EDIT}
                theme={theme}
                additionalContainerStyle={styles.roundButton}
                {...styles.icon}
              />
              <Text style={styles.buttonText}>{translate('common.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={() => setShowCancelConfirmationRCDelegation(true)}>
              <Icon
                name={Icons.GIFT_DELETE}
                theme={theme}
                additionalContainerStyle={styles.roundButton}
                {...styles.icon}
              />
              <Text style={styles.buttonText}>
                {translate('common.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {isItemSelected && showCancelConfirmationRCDelegation && !editMode && (
        <ConfirmationInItem
          theme={theme}
          titleKey="wallet.operations.rc_delegation.confirm_cancel_rc_delegation"
          onConfirm={() => onRCDelegate(true)}
          onCancel={() => setShowCancelConfirmationRCDelegation(false)}
          isLoading={isLoading}
          additionalConfirmTextStyle={styles.whiteText}
        />
      )}
      {editMode &&
        isItemSelected &&
        !showCancelConfirmationRCDelegation &&
        !isLoading && (
          <View>
            <View style={styles.flexRow}>
              <OperationInput
                labelInput={translate('common.currency')}
                placeholder={translate(
                  'wallet.operations.rc_delegation.giga_rc',
                )}
                value={translate('wallet.operations.rc_delegation.giga_rc')}
                editable={false}
                additionalOuterContainerStyle={{
                  width: '30%',
                }}
              />
              <OperationInput
                labelInput={capitalize(translate('common.amount'))}
                labelExtraInfo={
                  equivalentHPAmount
                    ? `≈ ${equivalentHPAmount} ${getCurrency('HP')}`
                    : undefined
                }
                placeholder={'0.000'}
                keyboardType="decimal-pad"
                textAlign="right"
                value={editedAmountDelegation}
                onChangeText={setEditedAmountDelegation}
                additionalOuterContainerStyle={{
                  width: '68%',
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
                      activeOpacity={1}
                      onPress={() =>
                        setEditedAmountDelegation(
                          getCleanAmountValue(available.gigaRcValue),
                        )
                      }>
                      <Text style={[styles.textBase, styles.redText]}>
                        {translate('common.max').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
            <View
              style={[
                styles.flexRowCenter,
                styles.marginTop,
                {justifyContent: 'center'},
              ]}>
              <ConfirmationInItem
                theme={theme}
                onCancel={() => setEditMode(false)}
                onConfirm={onRCDelegate}
                isLoading={isLoading}
                additionalConfirmTextStyle={styles.whiteText}
              />
            </View>
          </View>
        )}
      {editMode &&
        isItemSelected &&
        !showCancelConfirmationRCDelegation &&
        isLoading && <Loader size={'small'} animating />}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {marginLeft: 10},
    flexRow: {flexDirection: 'row', justifyContent: 'space-between'},
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      textAlign: 'right',
    },
    row: {flexDirection: 'row'},
    opaque: {opacity: 0.7},
    paddingHorizontal: {paddingHorizontal: 10},
    smallIcon: {width: 15, height: 15},
    buttonRowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    icon: {
      width: 18,
      height: 18,
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
    marginRight: {
      marginRight: 16,
    },
    marginLeft: {marginLeft: 16},
    roundButton: {
      borderWidth: 1,
      borderColor: getColors(theme).quinaryCardBorderColor,
      borderRadius: 100,
      width: 25,
      height: 25,
    },
    whiteText: {color: '#FFF'},
    margins: {marginTop: 10, marginBottom: 15},
    paddingLeft: {
      paddingLeft: 10,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
    biggerIcon: {width: 25, height: 25},
    marginTop: {marginTop: 8},
    italic: {fontFamily: FontPoppinsName.ITALIC},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      delegations: state.delegations,
      properties: state.properties,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomingOutgoingRcDelegationItem);
