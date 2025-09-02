// OrientationContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Orientation, {OrientationType} from 'react-native-orientation-locker';

const OrientationContext = createContext('PORTRAIT');

export const OrientationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orientation, setOrientation] = useState('PORTRAIT');

  useEffect(() => {
    const listener = (newOrientation: OrientationType) => {
      // Ignore weird states
      if (['UNKNOWN', 'FACE-UP', 'FACE-DOWN'].includes(newOrientation)) {
        setOrientation('PORTRAIT');
        return;
      }

      if (Platform.OS === 'android' && newOrientation !== 'PORTRAIT') {
        Orientation.getAutoRotateState((enabled) => {
          if (enabled) {
            setOrientation(newOrientation);
          }
        });
      } else {
        setOrientation(newOrientation);
      }
    };

    Orientation.addDeviceOrientationListener(listener);

    return () => {
      Orientation.removeDeviceOrientationListener(listener);
    };
  }, []);

  return (
    <OrientationContext.Provider value={orientation}>
      {children}
    </OrientationContext.Provider>
  );
};

// Hook for consuming the orientation globally
export const useOrientation = () => {
  return useContext(OrientationContext);
};
