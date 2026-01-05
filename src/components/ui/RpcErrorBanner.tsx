import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {goBackAndNavigate, navigate} from 'utils/navigation.utils';

interface RpcErrorBannerProps {
  errorMessageKey: string;
  style?: any;
  inSettings?: boolean;
  goBack?: boolean;
}

const RpcErrorBanner = ({
  errorMessageKey,
  style,
  inSettings = false,
  goBack = false,
}: RpcErrorBannerProps) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  const handlePress = useCallback(() => {
    if (inSettings) {
      navigate('SettingsRpcNodesScreen');
    } else {
      if (!goBack)
        navigate('SettingsScreen', {screen: 'SettingsRpcNodesScreen'});
      else
        goBackAndNavigate('SettingsScreen', {screen: 'SettingsRpcNodesScreen'});
    }
  }, []);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      delayPressIn={0}>
      <Text style={styles.text}>
        {translate(errorMessageKey)}{' '}
        {translate('common.tap_to_change_hive_engine_rpc')}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    text: {
      color: getColors(theme).secondaryText,
      textAlign: 'center',
      ...button_link_primary_medium,
    },
  });

export default RpcErrorBanner;
