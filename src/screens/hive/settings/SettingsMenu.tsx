import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {StatusBar, Text, View, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {getBadgeStyle} from 'src/styles/text';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import AutomatedTasks from './AutomatedTasks';
import Operations from './Operations';
import RpcNodes from './RpcNodes';

const SettingsMenu = () => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();

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
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.automated_tasks.title'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.automated_tasks.title'),
            component: <AutomatedTasks />,
          } as TemplateStackProps)
        }
        iconImage={
          <Icon
            name={Icons.AUTOMATED_TASKS}
            theme={theme}
            color={PRIMARY_RED_COLOR}
          />
        }
      />
      <MenuItem
        labelTranslationKey={'settings.settings.notifications.title'}
        theme={theme}
        onPress={() =>
          navigate('TemplateStack', {
            titleScreen: translate('settings.settings.notifications.title'),
            component: (
              <View>
                <Text>TODO NOW!!!</Text>
              </View>
            ),
          } as TemplateStackProps)
        }
        iconImage={
          <Icon
            name={Icons.NOTIFICATIONS}
            theme={theme}
            color={PRIMARY_RED_COLOR}
            width={55}
            height={55}
          />
        }
        leftSideComponent={
          <View style={getBadgeStyle(width, theme).container}>
            <Text style={getBadgeStyle(width, theme).text}>experimental</Text>
          </View>
        }
        additionalLeftSideComponentStyle={{alignSelf: 'flex-end'}}
      />
    </View>
  );
};

export default SettingsMenu;
