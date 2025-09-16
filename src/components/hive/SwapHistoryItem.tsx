import BackgroundIconRed from 'assets/images/background/background-icon-red.svg';
import Loader from 'components/ui/Loader';
import * as Clipboard from 'expo-clipboard';
import {
  IStepHistory,
  ISwap,
  StepHistoryStatus,
  SwapStatus,
} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {button_link_primary_small} from 'src/styles/typography';
import {withCommas} from 'utils/format.utils';
import {translate} from 'utils/localize';
import Icon from './Icon';

interface Props {
  theme: Theme;
  item: ISwap;
  currentIndex: number;
}

const SwapHistoryItem = ({theme, item, currentIndex}: Props) => {
  const [isExpanded, setIsExpanded] = useState(
    item.status !== SwapStatus.COMPLETED && currentIndex === 0,
  );

  const styles = getStyles(theme);

  const renderStepItemStatusIndicator = (status: StepHistoryStatus) => {
    let iconName = Icons.HISTORY;
    switch (status) {
      case StepHistoryStatus.SUCCESS:
        iconName = Icons.CHECK;
        break;
      case StepHistoryStatus.PENDING:
        iconName = Icons.HISTORY;
        break;
      case StepHistoryStatus.FAILED:
        iconName = Icons.CLOSE_CIRCLE;
        break;
      default:
        break;
    }
    return (
      <Icon
        theme={theme}
        name={iconName}
        color={PRIMARY_RED_COLOR}
        additionalContainerStyle={styles.statusIcon}
      />
    );
  };

  const renderSwapItemStatusIndicator = (status: SwapStatus) => {
    let iconName = Icons.HISTORY;
    switch (status) {
      case SwapStatus.COMPLETED:
        iconName = Icons.CHECK;
        break;
      case SwapStatus.STARTED:
      case SwapStatus.PENDING:
        iconName = Icons.HISTORY;
        break;
      case SwapStatus.CANCELED_DUE_TO_ERROR:
      case SwapStatus.FUNDS_RETURNED:
      case SwapStatus.REFUNDED_SLIPPAGE:
        iconName = Icons.CLOSE_CIRCLE;
        break;
      default:
        iconName = Icons.HISTORY;
        break;
    }
    return (
      <Icon
        theme={theme}
        name={iconName}
        color={PRIMARY_RED_COLOR}
        additionalContainerStyle={styles.statusIcon}
      />
    );
  };

  const renderTokensInStep = (step: IStepHistory) => {
    return (
      <Text style={styles.textBase}>
        {step.amountStartToken
          ? withCommas(step.amountStartToken.toFixed(3))
          : '...'}{' '}
        {step.startToken}
        {' => '}
        {step.amountEndToken
          ? withCommas(step.amountEndToken.toFixed(3))
          : '...'}{' '}
        {step.endToken}
      </Text>
    );
  };

  const renderStepItem = (step: IStepHistory) => {
    return (
      <View key={`${step.id}-${step.stepNumber}`} style={styles.stepDetail}>
        <Text style={styles.textBase}>{step.stepNumber} - </Text>
        <View style={{}}>{renderTokensInStep(step)}</View>
        {renderStepItemStatusIndicator(step.status)}
      </View>
    );
  };

  const getShortenedId = (id: string) => {
    return id.substring(0, 6) + '...' + id.slice(-6);
  };

  const onHandleCopyID = (id: string) => {
    Clipboard.setStringAsync(id);
    SimpleToast.show(translate('toast.copied_id'), {
      duration: SimpleToast.durations.LONG,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={() => setIsExpanded(!isExpanded)}>
      <View style={[styles.historyItemDetail]}>
        <Icon
          theme={theme}
          name={Icons.EXCHANGE_ARROW}
          bgImage={<BackgroundIconRed />}
          color={PRIMARY_RED_COLOR}
          additionalContainerStyle={{marginRight: 16}}
        />
        <Text style={[styles.textBase, styles.tokenIn]}>
          {item.amount} {item.startToken}
        </Text>
        <Icon
          theme={theme}
          name={Icons.EXCHANGE_ARROW_CIRCLED}
          color={PRIMARY_RED_COLOR}
          additionalContainerStyle={styles.swapIcon}
        />
        <Text style={[styles.textBase, styles.tokenOut]}>
          {item.received ? item.received : '...'} {item.endToken}
        </Text>
        <Icon
          theme={theme}
          name={Icons.EXPAND}
          additionalContainerStyle={
            isExpanded ? getRotateStyle('0') : getRotateStyle('180')
          }
          {...styles.smallIcon}
          color={PRIMARY_RED_COLOR}
        />
        {renderSwapItemStatusIndicator(item.status)}
      </View>
      {isExpanded && (
        <View style={[styles.marginTop]}>
          {(item.status === SwapStatus.STARTED ||
            item.status !== SwapStatus.COMPLETED) && (
            <View style={[styles.flexCentered, styles.fullWidth]}>
              <Loader animating size={'small'} />
            </View>
          )}
          {item.history.map((stepHistory) => renderStepItem(stepHistory))}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onHandleCopyID(item.id)}
            style={[styles.marginTop]}>
            <Text style={styles.textBase}>
              {translate('common.id')} - {getShortenedId(item.id)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      paddingHorizontal: 16,
    },

    historyItemDetail: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tokenIn: {
      flex: 3,
      textAlign: 'right',
    },
    tokenOut: {
      flex: 4,
      textAlign: 'left',
    },
    swapIcon: {
      marginHorizontal: 4,
    },
    statusIcon: {
      marginLeft: 8,
    },
    stepDetail: {
      marginTop: 10,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },

    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexRowCentered: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
      textAlignVertical: 'center',
    },
    smallIcon: {
      width: 14,
      height: 14,
    },
    marginBottom: {
      marginBottom: 10,
    },
    flexCentered: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullWidth: {
      width: '100%',
    },
    marginTop: {
      marginTop: 10,
    },
  });

export default React.memo(SwapHistoryItem);
