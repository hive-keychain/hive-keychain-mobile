import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {lock} from 'actions/index';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import React from 'react';
import {StyleSheet} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & DrawerContentComponentProps;
const HeaderContent = (props: Props) => {
  const {user, lock, navigation} = props;
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}>
      <DrawerHeader username={user.name} />
      <DrawerItemList {...props} />
      <DrawerItem
        {...props}
        label={translate('navigation.log_out')}
        onPress={() => {
          lock();
          navigation.closeDrawer();
        }}
      />
      <DrawerFooter user={user} />
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
