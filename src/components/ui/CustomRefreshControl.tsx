import React from 'react';
import {RefreshControl} from 'react-native';

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
  enabled: boolean;
};
const CustomRefreshControl = ({refreshing, onRefresh, enabled}: Props) => {
  return enabled ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      enabled={true}
    />
  ) : (
    <></>
  );
};

export default CustomRefreshControl;
