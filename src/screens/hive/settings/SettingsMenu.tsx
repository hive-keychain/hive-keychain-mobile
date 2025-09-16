import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import {useBackButtonNavigation} from 'hooks/useBackButtonNavigate';
import React from 'react';
import {StatusBar, Text, View, useWindowDimensions} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {getBadgeStyle} from 'src/styles/text';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';

const SettingsMenu = () => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();

  useBackButtonNavigation('Wallet');

  return (
    <View style={getMenuCardStyle(theme)}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.operations'}
        theme={theme}
        onPress={() => navigate('SettingsOperationsScreen')}
        iconImage={
          <Icon
            name={Icons.SETTINGS_OPERATIONS}
            theme={theme}
            color={PRIMARY_RED_COLOR}
          />
        }
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.rpc'}
        theme={theme}
        onPress={() => navigate('SettingsRpcNodesScreen')}
        iconImage={
          <Icon
            name={Icons.SETTINGS_RPC}
            theme={theme}
            color={PRIMARY_RED_COLOR}
          />
        }
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'settings.settings.automated_tasks.title'}
        theme={theme}
        onPress={() => navigate('SettingsAutomatedTasksScreen')}
        iconImage={
          <Icon
            name={Icons.AUTOMATED_TASKS}
            theme={theme}
            color={PRIMARY_RED_COLOR}
          />
        }
        drawBottomLine
      />
      <MenuItem
        labelTranslationKey={'settings.settings.multisig.title'}
        theme={theme}
        onPress={() => navigate('SettingsMultisigScreen')}
        iconImage={
          <Icon
            name={Icons.SETTINGS_MULTISIG}
            theme={theme}
            color={PRIMARY_RED_COLOR}
            width={45}
            height={45}
          />
        }
      />
      <MenuItem
        labelTranslationKey={'settings.settings.notifications.title'}
        theme={theme}
        onPress={() => navigate('SettingsNotificationsScreen')}
        iconImage={
          <Icon
            name={Icons.SETTINGS_NOTIFICATIONS}
            theme={theme}
            color={PRIMARY_RED_COLOR}
            width={55}
            height={55}
          />
        }
        leftSideComponent={
          <View style={getBadgeStyle(width, theme).container}>
            <Text style={getBadgeStyle(width, theme).text}>
              {translate('common.experimental')}
            </Text>
          </View>
        }
        additionalLeftSideComponentStyle={{alignSelf: 'flex-end'}}
      />

      <MenuItem
        labelTranslationKey={'settings.settings.export_transactions.title'}
        theme={theme}
        onPress={() => navigate('ExportTransactionsScreen')}
        iconImage={
          <Icon
            name={Icons.EXPORT}
            // theme={theme}
            color={PRIMARY_RED_COLOR}
            width={55}
            height={55}
          />
        }
        additionalLeftSideComponentStyle={{alignSelf: 'flex-end'}}
      />
    </View>
  );
};

export default SettingsMenu;
