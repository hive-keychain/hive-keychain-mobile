import {addTab} from 'actions/browser';
import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import Icon from 'components/hive/Icon';
import React from 'react';
import {Linking, StatusBar, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {RootState} from 'store';
import {tutorialBaseUrl} from 'utils/config.utils';
import {navigate} from 'utils/navigation.utils';

const Help = ({addTab}: PropsFromRedux) => {
  const {theme} = useThemeContext();

  const gotoBrowser = () => {
    addTab(tutorialBaseUrl + '/#/mobile');
    navigate('Browser');
  };

  return (
    <View style={getMenuCardStyle(theme)}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <MenuItem
        labelTranslationKey={'navigation.support'}
        theme={theme}
        onPress={() => Linking.openURL('https://discord.com/invite/3Sex2qYtXP')}
        iconImage={
          <Icon name={Icons.SUPPORT} theme={theme} color={PRIMARY_RED_COLOR} />
        }
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.tutorial'}
        theme={theme}
        onPress={() => gotoBrowser()}
        iconImage={
          <Icon name={Icons.TUTORIAL} theme={theme} color={PRIMARY_RED_COLOR} />
        }
      />
    </View>
  );
};

const connector = connect(
  (state: RootState) => {
    return {};
  },
  {addTab},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const SubMenuHelp = connector(Help);
