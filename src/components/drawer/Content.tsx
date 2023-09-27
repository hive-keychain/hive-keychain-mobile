import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {closeAllTabs, lock} from 'actions/index';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & DrawerContentComponentProps;

const hiddenRoutesInMain = [
  'CreateAccountScreen',
  'AddAccountStack',
  'AccountManagementScreen',
  'WALLET',
  'BrowserScreen',
];

const HeaderContent = (props: Props) => {
  const {user, lock, navigation, itemStyle, state, ...rest} = props;
  const [isAccountMenuExpanded, setIsAccountMenuExpanded] = useState(false);
  const [subMenuSelectedScreenName, setSubMenuSelectedScreenName] = useState(
    '',
  );
  const subMenuList = [
    {
      labelTranslationKey: 'navigation.manage',
      screenName: 'AccountManagementScreen',
    },
    {
      labelTranslationKey: 'navigation.add_account',
      screenName: 'AddAccountStack',
    },
    {
      labelTranslationKey: 'navigation.create_account',
      screenName: 'CreateAccountScreen',
    },
  ];

  const newState = {...state};
  newState.routes = newState.routes.filter(
    (route) => !hiddenRoutesInMain.includes(route.name),
  );

  const handleSetMenuExpanded = () => {
    if (isAccountMenuExpanded && subMenuSelectedScreenName.length) return;
    setIsAccountMenuExpanded(!isAccountMenuExpanded);
    if (!isAccountMenuExpanded) setSubMenuSelectedScreenName('');
  };

  useEffect(() => {
    if (newState.index < 5 && isAccountMenuExpanded) {
      setIsAccountMenuExpanded(false);
    }
  }, [newState.index]);

  //TODO to remove bellow after refactoring UI
  const {theme, setTheme} = useContext(ThemeContext);
  //END to remove

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}>
      <ScrollView
        style={{flex: 1, height: '100%'}}
        contentContainerStyle={{
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <>
          <DrawerHeader theme={theme} props={props} />
          <DrawerItem
            {...props}
            label={translate('navigation.wallet')}
            onPress={() => {
              navigation.navigate('WALLET');
            }}
            style={itemStyle}
            focused={newState.index === 0 && !isAccountMenuExpanded}
          />
          <TouchableOpacity
            onLongPress={() => {
              props.closeAllTabs();
              SimpleToast.show('Browser data was deleted');
            }}>
            <DrawerItem
              {...props}
              label={translate('navigation.browser')}
              onPress={() => {
                navigation.navigate('BrowserScreen');
              }}
              focused={newState.index === 1 && !isAccountMenuExpanded}
              style={itemStyle}
            />
          </TouchableOpacity>
          {/* //TODO remove item, made to change context */}
          <DrawerItem
            {...props}
            label={`Toogle Theme : ${theme}`}
            onPress={() =>
              setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
            }
          />
          {/* //END remove */}
          <DrawerItem
            {...props}
            label={translate('navigation.accounts')}
            onPress={() => handleSetMenuExpanded()}
            focused={isAccountMenuExpanded}
            style={itemStyle}
          />
          {isAccountMenuExpanded &&
            subMenuList.map((subMenu) => (
              <DrawerItem
                {...props}
                style={[{paddingLeft: 20}]}
                key={`${subMenu.screenName}-sub-item-accounts`}
                label={translate(subMenu.labelTranslationKey)}
                onPress={() => {
                  setSubMenuSelectedScreenName(subMenu.screenName);
                  navigation.navigate(subMenu.screenName);
                }}
                focused={
                  subMenuSelectedScreenName === subMenu.screenName &&
                  isAccountMenuExpanded
                }
              />
            ))}
          <DrawerItemList
            state={{
              ...newState,
              index: isAccountMenuExpanded ? -1 : newState.index - 2,
            }}
            navigation={navigation}
            itemStyle={itemStyle}
            {...rest}
          />
          <DrawerItem
            {...props}
            label={translate('navigation.log_out')}
            onPress={() => {
              lock();
              navigation.closeDrawer();
            }}
          />
        </>
        <DrawerFooter user={user} />
      </ScrollView>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainer: {height: '100%', flex: 1, zIndex: 0},
});
const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount,
});

const connector = connect(mapStateToProps, {lock, closeAllTabs});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeaderContent);
