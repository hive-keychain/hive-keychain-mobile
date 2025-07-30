import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';

const SwapDisplay = ({
  startToken,
  endToken,
  amount,
  estimateValue,
}: {
  startToken: string;
  endToken: string;
  amount: number;
  estimateValue?: number;
}) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  {
    /* <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>
        {translate('request.item.swap')}
      </Text>
      <View style={styles.swapContent}>
        {estimateValue ? (
          <>
            <Text style={[styles.textBase, styles.content, styles.opaque]}>
              {`${amount} ${startToken}`}
            </Text>
            <Icon
              name={Icons.ARROW_RIGHT_BROWSER}
              additionalContainerStyle={styles.arrowIcon}
              width={20}
              height={20}
              theme={theme}
              color={getColors(theme).iconBW}
            />
            <Text style={[styles.textBase, styles.content, styles.opaque]}>
              {`${estimateValue} ${endToken}`}
            </Text>
          </>
        ) : (
          <Text style={[styles.textBase, styles.content, styles.opaque]}>
            calculating...
          </Text>
        )}
      </View>
    </View> */
  }
  return (
    <View style={styles.balanceRow}>
      {!estimateValue ? (
        <Text style={styles.errorText}>...</Text>
      ) : (
        <>
          <View style={styles.balanceColumn}>
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
              ]}>
              {`${amount} ${startToken}`}
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name={Icons.ARROW_RIGHT_BROWSER}
              additionalContainerStyle={styles.arrowIcon}
              width={16}
              height={16}
              theme={theme}
              color={getColors(theme).iconBW}
            />
          </View>
          <View style={styles.balanceColumn}>
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
              ]}>
              {`${estimateValue} ${endToken}`}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    balanceRow: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
      flexShrink: 1,
    },
    balanceColumn: {
      flexShrink: 1,
    },
    arrowContainer: {
      alignItems: 'center',
      transform: [{rotate: '90deg'}],
    },
    arrowIcon: {
      marginHorizontal: 0,
    },
    textContent: {
      color: getColors(theme).secondaryText,
      textAlign: 'right',
      flexWrap: 'wrap',
    },
    errorText: {
      color: getColors(theme).primaryText,
    },
  });

export default SwapDisplay;
