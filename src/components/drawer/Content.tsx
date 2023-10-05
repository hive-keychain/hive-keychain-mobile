import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {closeAllTabs, lock} from 'actions/index';
import SwitchDarkIcon from 'assets/new_UI/moon.svg';
import SwitchLightIcon from 'assets/new_UI/sun.svg';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import CustomSwitch from 'components/form/CustomSwitch';
import Icon from 'components/hive/Icon';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import DrawerContentItem from './drawer-content-item/DrawerContentItem';

type Props = PropsFromRedux & DrawerContentComponentProps;

const hiddenRoutesInMain = [
  'CreateAccountScreen',
  'AddAccountStack',
  'AccountManagementScreen',
  'WALLET',
  'BrowserScreen',
  'Governance',
  'SettingsScreen',
  'ABOUT',
  'Accounts',
  'Tokens',
  'TokensHistory',
];

const HeaderContent = (props: Props) => {
  //TODO cleanup remove unused
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

  const {theme, setTheme} = useContext(ThemeContext);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}>
      <DrawerHeader theme={theme} props={props} />
      <ScrollView>
        {/* <DrawerItem
          {...props}
          label={translate('navigation.wallet')}
          onPress={() => {
            navigation.navigate('WALLET');
          }}
          style={itemStyle}
          focused={newState.index === 0 && !isAccountMenuExpanded}
        /> */}
        <DrawerContentItem
          labelTranslationKey="navigation.accounts"
          theme={theme}
          onPress={() => navigation.navigate('Accounts')}
          iconImage={<Icon name={'accounts'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.settings"
          theme={theme}
          onPress={() => navigation.navigate('SettingsScreen')}
          iconImage={<Icon name="candle" theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.tokens"
          theme={theme}
          onPress={() => navigation.navigate('Tokens')}
          iconImage={<Icon name={'tokens'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.governance"
          theme={theme}
          onPress={() => navigation.navigate('Governance')}
          iconImage={<Icon name={'governance'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.theme_setting"
          theme={theme}
          onPress={() => {}}
          iconImage={<Icon name={'theme'} theme={theme} />}
          leftSideComponent={
            <CustomSwitch
              theme={theme}
              iconLeftSide={<SwitchLightIcon width={24} height={24} />}
              iconRightSide={<SwitchDarkIcon width={24} height={24} />}
              initalValue={theme === Theme.LIGHT}
              valueTrue={Theme.LIGHT}
              valueFalse={Theme.DARK}
              onValueChange={(value) => {
                setTheme(value);
              }}
            />
          }
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.about"
          theme={theme}
          onPress={() => navigation.navigate('ABOUT')}
          iconImage={<Icon name={'info'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.log_out"
          theme={theme}
          onPress={() => {
            lock();
            navigation.closeDrawer();
          }}
          iconImage={<Icon name={'logout'} theme={theme} />}
        />

        {/* //TODO cleanup unused code */}
        {/* <TouchableOpacity
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
          ))} */}

        <DrawerItemList
          state={{
            ...newState,
            index: isAccountMenuExpanded ? -1 : newState.index - 2,
          }}
          navigation={navigation}
          itemStyle={itemStyle}
          {...rest}
        />
      </ScrollView>
      <DrawerFooter user={user} theme={theme} />
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
