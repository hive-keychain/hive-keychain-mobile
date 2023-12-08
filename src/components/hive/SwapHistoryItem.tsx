import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import Loader from 'components/ui/Loader';
import {
  IStepHistory,
  ISwap,
  StepHistoryStatus,
  SwapStatus,
} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {
  Clipboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {button_link_primary_small} from 'src/styles/typography';
import {withCommas} from 'utils/format';
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
    let iconName = 'back_time';
    switch (status) {
      case StepHistoryStatus.SUCCESS:
        iconName = 'check';
        break;
      case StepHistoryStatus.PENDING:
        iconName = 'back_time';
        break;
      case StepHistoryStatus.FAILED:
        iconName = 'close_circle';
        break;
      default:
        break;
    }
    return <Icon theme={theme} name={iconName} />;
  };

  const renderSwapItemStatusIndicator = (status: SwapStatus) => {
    let iconName = '';
    switch (status) {
      case SwapStatus.COMPLETED:
        iconName = 'check';
        break;
      case SwapStatus.STARTED:
      case SwapStatus.PENDING:
        iconName = 'back_time';
        break;
      case SwapStatus.CANCELED_DUE_TO_ERROR:
      case SwapStatus.FUNDS_RETURNED:
      case SwapStatus.REFUNDED_SLIPPAGE:
        iconName = 'close_circle';
        break;
      default:
        iconName = 'back_time';
        break;
    }
    return <Icon theme={theme} name={iconName} />;
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
      <View
        key={`${step.id}-${step.stepNumber}`}
        style={[styles.flexRowBetween, styles.fullWidth, styles.marginTop]}>
        <Text style={styles.textBase}>{step.stepNumber}</Text>
        <View style={styles.flexRowCentered}>
          {/* <Text style={styles.textBase}>
            {withCommas(step.amountStartToken.toFixed(3))} {step.startToken}
            {' => '}
            {withCommas(step.amountEndToken.toFixed(3))} {step.endToken}
          </Text> */}
          {renderTokensInStep(step)}
        </View>
        {renderStepItemStatusIndicator(step.status)}
      </View>
    );
  };

  const onHandleCopyID = (id: string) => {
    Clipboard.setString(id);
    SimpleToast.show(translate('toast.copied_id'), SimpleToast.LONG);
  };

  return (
    <TouchableOpacity
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={() => setIsExpanded(!isExpanded)}>
      <View style={[styles.flexRowBetween]}>
        <Icon theme={theme} name="repeat" bgImage={<BackgroundIconRed />} />
        <View style={styles.flexRowCentered}>
          <Text style={styles.textBase}>
            {item.amount} {item.startToken}
          </Text>
          <Icon theme={theme} name="repeat-circle" />
          <Text style={styles.textBase}>
            {item.received ? item.received : '...'} {item.endToken}
          </Text>
        </View>
        <Icon
          theme={theme}
          name="expand_thin"
          additionalContainerStyle={
            isExpanded ? getRotateStyle('180') : getRotateStyle('0')
          }
          {...styles.smallIcon}
        />
        {renderSwapItemStatusIndicator(item.status)}
      </View>
      {isExpanded && (
        <View style={[styles.flexCentered, styles.marginTop]}>
          {(item.status === SwapStatus.STARTED ||
            item.status !== SwapStatus.COMPLETED) && (
            <View style={[styles.flexCentered, styles.fullWidth]}>
              <Loader animating size={'small'} />
            </View>
          )}
          {item.history.map((stepHistory) => renderStepItem(stepHistory))}
          <TouchableOpacity
            onPress={() => onHandleCopyID(item.id)}
            style={[styles.flexRowBetween, styles.fullWidth, styles.marginTop]}>
            <Text style={styles.textBase}>{translate('common.id')}</Text>
            <View style={styles.flexRowCentered}>
              <Text style={styles.textBase}>
                {item.id.length > 15
                  ? `${item.id.substring(0, 15)}...`
                  : item.id}
              </Text>
              <Icon theme={theme} name="copy" />
            </View>
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

export default SwapHistoryItem;
