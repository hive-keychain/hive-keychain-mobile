import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import DrawerHeader from 'components/drawer/Header';
import {connect} from 'react-redux';
import {lock} from 'actions';

const HeaderContent = (props) => {
  const {user, lockConnect} = props;
  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader username={user} />
      <DrawerItemList {...props} />
      <DrawerItem
        {...props}
        label="LOG OUT"
        onPress={() => {
          lockConnect();
        }}
      />
    </DrawerContentScrollView>
  );
};

const mapStateToProps = (state) => ({user: state.activeAccount.name});

export default connect(mapStateToProps, {lockConnect: lock})(HeaderContent);
