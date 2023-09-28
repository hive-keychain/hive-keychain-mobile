import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {closeAllTabs, lock} from 'actions/index';
import GovernanceMenuIcon from 'assets/new_UI/bank.svg';
import UserPrefMenuIcon from 'assets/new_UI/candle-2.svg';
import ThemeMenuIcon from 'assets/new_UI/category.svg';
import TokensMenuIcon from 'assets/new_UI/hive_red_alternative_logo.svg';
import AboutMenuIcon from 'assets/new_UI/info-circle.svg';
import BottomLineDark from 'assets/new_UI/line_dark.svg';
import BottomLineLight from 'assets/new_UI/line_light.svg';
import LogoutMenuIcon from 'assets/new_UI/logout.svg';
import SwitchDarkIcon from 'assets/new_UI/moon.svg';
import AccountsMenuIcon from 'assets/new_UI/profile.svg';
import SwitchLightIcon from 'assets/new_UI/sun.svg';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import CustomSwitch from 'components/form/CustomSwitch';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import DrawerContentItem from './drawer-content-item/DrawerContentItem';

//TODO remove reference names
//  about keychain    'info-circle.svg'
//  accounts          'profile.svg'
//  governance        'bank.svg'
//  logout            'logout.svg'
//  theme setting     'category.svg'
//  user preferences  'candle-2.svg'
//  tokens            'hive_red_alternative_logo.svg'

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

  const {theme, setTheme} = useContext(ThemeContext);

  const lineSVGProps = {
    //TODO find which approach is better:
    //  - or set the svg or draw the line.
    //  - you must add this lines as relative to the "item label", so maybe it is better to code your own "DrawerItem" like.
    lineSvgBottomDark: (
      <View style={{alignSelf: 'flex-end'}}>
        <BottomLineDark width={300} />
      </View>
    ),
    lineSvgBottomLight: <BottomLineLight />,
  };

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
          {...props}
          labelTranslationKey="navigation.accounts"
          theme={theme}
          //TODO bellow, add new stack to show submenus.
          onPress={() => {}}
          iconImage={<AccountsMenuIcon />}
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.settings"
          theme={theme}
          onPress={() => navigation.navigate('SettingsScreen')}
          iconImage={<UserPrefMenuIcon />}
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.tokens"
          theme={theme}
          //TODO add new tockets stack?? + screen in MainDrawer.
          onPress={() => {}}
          iconImage={<TokensMenuIcon />}
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.governance"
          theme={theme}
          onPress={() => navigation.navigate('Governance')}
          iconImage={<GovernanceMenuIcon />}
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.theme_setting"
          theme={theme}
          onPress={() => {}}
          iconImage={<ThemeMenuIcon />}
          leftSideComponent={
            <CustomSwitch
              theme={theme}
              iconLeftSide={<SwitchLightIcon />}
              iconRightSide={<SwitchDarkIcon />}
              initalValue={theme === Theme.LIGHT}
              valueTrue={Theme.LIGHT}
              valueFalse={Theme.DARK}
              onValueChange={(value) => {
                setTheme(value);
              }}
            />
          }
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.about"
          theme={theme}
          onPress={() => navigation.navigate('ABOUT')}
          iconImage={<AboutMenuIcon />}
          {...lineSVGProps}
        />
        <DrawerContentItem
          {...props}
          labelTranslationKey="navigation.log_out"
          theme={theme}
          onPress={() => {
            lock();
            navigation.closeDrawer();
          }}
          iconImage={<LogoutMenuIcon />}
        />

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
