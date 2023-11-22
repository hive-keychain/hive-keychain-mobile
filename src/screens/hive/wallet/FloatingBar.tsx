import Icon from 'components/hive/Icon';
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  show: boolean;
  showTags?: boolean;
}
//TODO keep working on this.
const FloatingBar = ({show, showTags}: Props) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return show ? (
    <View style={[getCardStyle(theme).floatingBar, styles.container]}>
      <View style={styles.itemContainer}>
        <Icon theme={theme} name="wallet_add" {...styles.icon} />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.ecosystem')}
          </Text>
        )}
      </View>
      <View style={styles.itemContainer}>
        <Icon theme={theme} name="global" {...styles.icon} />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.browser')}
          </Text>
        )}
      </View>
      <View style={styles.itemContainer}>
        <Icon theme={theme} name="scanner" {...styles.icon} />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.buy')}
          </Text>
        )}
      </View>
      <View style={styles.itemContainer}>
        <Icon theme={theme} name="swap" {...styles.icon} />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.swap')}
          </Text>
        )}
      </View>
    </View>
  ) : null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '95%',
      marginBottom: 0,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textBase: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '25%',
    },
    icon: {
      width: 30,
      height: 30,
    },
    marginTop: {
      marginTop: 5,
    },
  });

export default FloatingBar;
