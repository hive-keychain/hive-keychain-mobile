import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {lock} from 'actions/index';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & DrawerContentComponentProps;

const hiddenRoutesInMain = [
  'CreateAccountScreen',
  'AddAccountStack',
  'AccountManagementScreen',
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
    setIsAccountMenuExpanded(!isAccountMenuExpanded);
    if (!isAccountMenuExpanded) setSubMenuSelectedScreenName('');
  };

  useEffect(() => {
    if (newState.index < 5 && isAccountMenuExpanded) {
      setIsAccountMenuExpanded(false);
    }
  }, [newState.index]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}>
      <ScrollView style={{flex: 1, height: '100%'}}>
        <DrawerHeader username={user.name} />
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
              key={`${subMenu.screenName}-sub-item-accounts`}
              label={`\t\t` + translate(subMenu.labelTranslationKey)}
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
            index: isAccountMenuExpanded ? -1 : newState.index,
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
        <DrawerFooter user={user} />
      </ScrollView>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({contentContainer: {height: '100%'}});
const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount,
});

const connector = connect(mapStateToProps, {lock});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeaderContent);
