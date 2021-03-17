import React from 'react';
import {View, StyleSheet} from 'react-native';
import Operation from 'components/operations/Operation';

export default ({accounts, request, onForceCloseModal}) => {
  const renderOperationDetails = () => {
    return null;
  };
  return (
    <Operation title="a" onClose={onForceCloseModal}>
      {renderOperationDetails()}
    </Operation>
  );
};
