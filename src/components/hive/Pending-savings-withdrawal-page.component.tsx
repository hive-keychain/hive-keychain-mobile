import {loadAccount} from 'actions/index';
import OperationThemed from 'components/operations/OperationThemed';
import {SavingsOperations} from 'components/operations/Savings';
import ConfirmationInItem from 'components/ui/ConfirmationInItem';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useState} from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {withCommas} from 'utils/format';
import {cancelPendingSavings} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Icon from './Icon';

type Props = PropsFromRedux & {
  currency: string;
  operation: SavingsOperations;
  currentWithdrawingList: SavingsWithdrawal[];
  onUpdate: (list: SavingsWithdrawal[]) => void;
};
const PendingSavingsWithdrawalPageComponent = ({
  user,
  loadAccount,
  currency: c,
  operation,
  currentWithdrawingList,
  onUpdate,
}: Props) => {
  const [currency, setCurrency] = useState(c);
  const [toCancelSaving, setToCancelSaving] = useState<SavingsWithdrawal>();
  const [loading, setLoading] = useState(false);
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, useWindowDimensions(), theme);

  const onCancelPendingSavings = async () => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      await cancelPendingSavings(user.keys.active!, {
        from: user.name!,
        request_id: toCancelSaving.request_id,
      });
      loadAccount(user.account.name, true);
      const newList = [...currentWithdrawingList];
      onUpdate(newList.filter((item) => item.id !== toCancelSaving.id));
      Toast.show(
        translate(
          'wallet.operations.savings.pending_withdraw.cancelled.success',
        ),
        Toast.LONG,
      );
    } catch (e) {
      Toast.show(`Error: ${(e as any).message}`, Toast.LONG);
    } finally {
      setLoading(false);
      setToCancelSaving(undefined);
      goBack();
    }
  };

  const renderListItem = (item: SavingsWithdrawal) => {
    const cancelSavingWithDraw = () => {
      setToCancelSaving(item);
    };

    return (
      <View style={[getCardStyle(theme).defaultCardItem]}>
        <View style={styles.flexRow}>
          <Text style={[styles.textBase, styles.smallerText]}>{`${withCommas(
            item.amount,
          )} ${currency}`}</Text>
          <Text style={[styles.textBase, styles.smallerText]}>{`On ${moment(
            item.complete,
          ).format('L')}`}</Text>
          <TouchableOpacity onPress={cancelSavingWithDraw}>
            <Icon name={Icons.REMOVE} theme={theme} />
          </TouchableOpacity>
        </View>
        {toCancelSaving && toCancelSaving.id === item.id && (
          <ConfirmationInItem
            theme={theme}
            titleKey="wallet.operations.savings.pending_withdraw.cancel_confirm_disclaimer"
            onCancel={() => setToCancelSaving(undefined)}
            onConfirm={onCancelPendingSavings}
            isLoading={loading}
          />
        )}
      </View>
    );
  };

  return (
    <OperationThemed
      additionalContentContainerStyle={styles.contentContainer}
      childrenMiddle={
        <>
          <Separator />
          <Text style={[styles.disclaimer, styles.textBase, styles.opaque]}>
            {translate(
              'wallet.operations.savings.pending_withdraw.pending_disclaimer',
              {currency},
            )}
          </Text>
          <Separator
            drawLine
            height={10}
            additionalLineStyle={styles.bottomLine}
          />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{width: '100%', height: '100%'}}>
            <FlatList
              data={currentWithdrawingList.filter(
                (currentWithdrawItem) =>
                  currentWithdrawItem.amount.split(' ')[1] === currency,
              )}
              keyExtractor={(listItem) => listItem.request_id.toString()}
              renderItem={(withdraw) => renderListItem(withdraw.item)}
              style={styles.containerMaxHeight}
              ListEmptyComponent={() => {
                return (
                  <View style={[styles.containerCentered, styles.marginTop]}>
                    <Text style={[styles.textBase]}>
                      {translate(
                        'wallet.operations.savings.pending_withdraw.no_pending_withdrawals',
                        {currency},
                      )}
                    </Text>
                  </View>
                );
              }}
            />
          </ScrollView>
        </>
      }
    />
  );
};

const getDimensionedStyles = (
  color: string,
  {width, height}: Dimensions,
  theme: Theme,
) =>
  StyleSheet.create({
    disclaimer: {textAlign: 'center'},
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
    smallerText: {
      fontSize: 13,
    },
    containerCentered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerMaxHeight: {
      maxHeight: 200,
    },
    marginTop: {
      marginTop: 30,
    },
    contentContainer: {marginTop: 50, paddingHorizontal: 15},
    opaque: {opacity: 0.7},
    flexRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    bottomLine: {
      borderColor: getColors(theme).lineSeparatorStroke,
      marginBottom: 20,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {
    loadAccount,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PendingSavingsWithdrawalPageComponent);
