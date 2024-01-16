import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Operations from './Operations';
import RpcNodes from './RpcNodes';

const SettingsMenu = () => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useBackButtonNavigation('WALLET');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.operations'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.operations'),
            component: <Operations />,
          } as TemplateStackProps)
        }
        iconImage={
          <Icon name={Icons.CPU} theme={theme} color={PRIMARY_RED_COLOR} />
        }
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.rpc'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.rpc'),
            component: <RpcNodes />,
          } as TemplateStackProps)
        }
        iconImage={
          <Icon name={Icons.RPC} theme={theme} color={PRIMARY_RED_COLOR} />
        }
        drawBottomLine={true}
      />
    </View>
  );
};

export default SettingsMenu;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 11,
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      backgroundColor: getColors(theme).cardBgLighter,
      paddingVertical: 25,
      paddingHorizontal: 14,
    },
    text: {
      color: getColors(theme).secondaryText,
    },
  });
