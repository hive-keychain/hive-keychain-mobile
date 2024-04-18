import {addTab} from 'actions/browser';
import SupportIcon from 'assets/new_UI/support.svg';
import MenuItem from 'components/drawer/drawer-content-item/MenuItem';
import React from 'react';
import {Linking, StatusBar, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getMenuCardStyle} from 'src/styles/menu';
import {RootState} from 'store';
import {tutorialBaseUrl} from 'utils/config';
import {navigate} from 'utils/navigation';

const Help = ({addTab}: PropsFromRedux) => {
  const {theme} = useThemeContext();

  const gotoBrowser = () => {
    addTab(tutorialBaseUrl + '/#/mobile');
    navigate('BrowserScreen');
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
        iconImage={<SupportIcon />}
        drawBottomLine={true}
      />
      <MenuItem
        labelTranslationKey={'navigation.tutorial'}
        theme={theme}
        onPress={() => gotoBrowser()}
        //TODO bellow change icon
        iconImage={<SupportIcon />}
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
