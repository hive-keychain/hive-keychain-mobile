import DrawerContentItem from 'components/drawer/drawer-content-item/DrawerContentItem';
import Icon from 'components/hive/Icon';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import {TemplateStackProps} from 'navigators/Root.types';
import React, {useContext} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Operations from './Operations';
import RpcNodes from './RpcNodes';

const SettingsMenu = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  useBackButtonNavigation('WALLET');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <DrawerContentItem
        labelTranslationKey={'settings.settings.operations'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.operations'),
            component: <Operations />,
          } as TemplateStackProps)
        }
        iconImage={<Icon name="cpu" theme={theme} />}
        drawBottomLine={true}
      />
      <DrawerContentItem
        labelTranslationKey={'settings.settings.rpc'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.rpc'),
            component: <RpcNodes />,
          } as TemplateStackProps)
        }
        iconImage={<Icon name="rpc" theme={theme} />}
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
