import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {lock} from 'actions/index';
import DrawerHeader from 'components/drawer/Header';
import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & DrawerContentComponentProps;
const HeaderContent = (props: Props) => {
  const {user, lock, navigation} = props;
  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader username={user} />
      <DrawerItemList {...props} />
      <DrawerItem
        {...props}
        label={translate('navigation.log_out')}
        onPress={() => {
          lock();
          navigation.closeDrawer();
        }}
      />
    </DrawerContentScrollView>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount.name,
});
const connector = connect(mapStateToProps, {lock});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(HeaderContent);
