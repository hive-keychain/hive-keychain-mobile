import Icon from 'components/hive/Icon';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {LinkTooltipState} from './types';

const LINK_TOOLTIP_WIDTH = 240;
const LINK_TOOLTIP_HEIGHT = 184;
const LINK_TOOLTIP_MARGIN = 0;
const LINK_TOOLTIP_LINK_GAP_ABOVE = 0;
const LINK_TOOLTIP_LINK_GAP_BELOW = 25;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type Props = {
  linkTooltip: LinkTooltipState | null;
  theme: Theme;
  onClose: () => void;
  onOpenCurrent: (url: string) => void;
  onOpenAnother: (url: string) => void;
  onCopy: (url: string) => void;
  onShare: (url: string) => void;
};

const LinkTooltip = ({
  linkTooltip,
  theme,
  onClose,
  onOpenCurrent,
  onOpenAnother,
  onCopy,
  onShare,
}: Props) => {
  const {width: screenWidth, height: screenHeight} = useWindowDimensions();
  const colors = getColors(theme);
  const styles = getStyles(theme);

  if (!linkTooltip) {
    return null;
  }

  const tooltipLeft = clamp(
    linkTooltip.x - LINK_TOOLTIP_WIDTH / 2,
    LINK_TOOLTIP_MARGIN,
    Math.max(
      LINK_TOOLTIP_MARGIN,
      screenWidth - LINK_TOOLTIP_WIDTH - LINK_TOOLTIP_MARGIN,
    ),
  );

  const maxTop = Math.max(
    LINK_TOOLTIP_MARGIN,
    screenHeight - LINK_TOOLTIP_HEIGHT - LINK_TOOLTIP_MARGIN,
  );
  const belowTop = linkTooltip.y + LINK_TOOLTIP_LINK_GAP_BELOW;
  const aboveTop =
    linkTooltip.y - LINK_TOOLTIP_HEIGHT - LINK_TOOLTIP_LINK_GAP_ABOVE;
  const shouldPreferAbove =
    belowTop > maxTop || linkTooltip.y > screenHeight * 0.65;
  let tooltipTop = shouldPreferAbove ? aboveTop : belowTop;
  if (
    shouldPreferAbove &&
    tooltipTop < LINK_TOOLTIP_MARGIN &&
    belowTop <= maxTop
  ) {
    tooltipTop = belowTop;
  }
  tooltipTop = clamp(tooltipTop, LINK_TOOLTIP_MARGIN, maxTop);

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View
        style={[
          styles.container,
          {left: tooltipLeft, top: tooltipTop},
        ]}>
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.8}
          onPress={() => onOpenCurrent(linkTooltip.url)}>
          <View style={styles.actionContent}>
            <Icon
              theme={theme}
              name={Icons.OPEN}
              width={16}
              height={16}
              color={colors.secondaryText}
            />
            <Text style={styles.actionText}>
              {translate('browser.link_long_press.open')}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.8}
          onPress={() => onOpenAnother(linkTooltip.url)}>
          <View style={styles.actionContent}>
            <Icon
              theme={theme}
              name={Icons.ADD_TAB}
              width={16}
              height={16}
              color={colors.secondaryText}
            />
            <Text style={styles.actionText}>
              {translate('browser.link_long_press.open_in_another_tab')}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.8}
          onPress={() => onCopy(linkTooltip.url)}>
          <View style={styles.actionContent}>
            <Icon
              theme={theme}
              name={Icons.COPY}
              width={16}
              height={16}
              color={colors.secondaryText}
            />
            <Text style={styles.actionText}>
              {translate('browser.link_long_press.copy_link')}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.8}
          onPress={() => onShare(linkTooltip.url)}>
          <View style={styles.actionContent}>
            <Icon
              theme={theme}
              name={Icons.SHARE}
              width={16}
              height={16}
              color={colors.secondaryText}
            />
            <Text style={styles.actionText}>{translate('common.share')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const getStyles = (theme: Theme) => {
  const colors = getColors(theme);
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 20,
    },
    container: {
      position: 'absolute',
      width: LINK_TOOLTIP_WIDTH,
      backgroundColor: colors.secondaryCardBgColor,
      borderWidth: 1,
      borderColor: colors.cardBorderColor,
      borderRadius: 10,
      overflow: 'hidden',
      zIndex: 21,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    action: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    actionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionText: {
      ...button_link_primary_small,
      color: colors.secondaryText,
      marginLeft: 10,
      flexShrink: 1,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.cardBorderColor,
    },
  });
};

export default LinkTooltip;
