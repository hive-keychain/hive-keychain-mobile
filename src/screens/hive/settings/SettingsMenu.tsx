import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Operations from './Operations';
import RpcNodes from './RpcNodes';

const SettingsMenu = () => {
  const {theme} = useThemeContext();

  useBackButtonNavigation('WALLET');

  return (
    <View style={getMenuCardStyle(theme)}>
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
      />
    </View>
  );
};

export default SettingsMenu;
