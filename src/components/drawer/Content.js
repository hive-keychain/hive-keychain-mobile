import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import DrawerHeader from 'components/drawer/Header';
import {connect} from 'react-redux';

const HeaderContent = (props) => {
  const {user} = props;
  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader username={user} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const mapStateToProps = (state) => ({user: state.activeAccount.name});

export default connect(mapStateToProps)(HeaderContent);
