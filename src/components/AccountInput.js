import React from 'react';
import {Input} from 'react-native-elements';

export default (props) => {
  return (
    <Input {...props} leftIcon={{type: 'material', name: 'account-circle'}} />
  );
};
