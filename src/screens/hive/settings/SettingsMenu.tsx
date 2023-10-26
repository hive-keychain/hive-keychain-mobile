import DrawerContentItem from 'components/drawer/drawer-content-item/DrawerContentItem';
import Icon from 'components/hive/Icon';
import {GeneralStackProps} from 'navigators/Root.types';
import React, {useContext} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Operations from './Operations';

const SettingsMenu = () => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={getColors(theme).barStyle}
        backgroundColor={getColors(theme).primaryBackground}
      />
      <DrawerContentItem
        labelTranslationKey={'settings.settings.operations'}
        theme={theme}
        //TODO extract from important to use: import Settings from 'screens/hive/settings/Settings';
        //  1.  operations & makes as design
        //  2.  rpc nodes & make as design
        onPress={() =>
          //TODO change this GeneralStack name,
          navigate('GeneralStack', {
            titleScreen: translate('settings.settings.operations'),
            component: <Operations />,
          } as GeneralStackProps)
        }
        iconImage={<Icon name="cpu" theme={theme} />}
        drawBottomLine={true}
      />
      <DrawerContentItem
        labelTranslationKey={'settings.settings.rpc'}
        theme={theme}
        //TODO idem as bellow
        onPress={() =>
          navigate('GeneralStack', {
            titleScreen: translate('settings.settings.rpc'),
            component: (
              <View>
                <Text>TODO rpc bellow</Text>
              </View>
            ),
          } as GeneralStackProps)
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
