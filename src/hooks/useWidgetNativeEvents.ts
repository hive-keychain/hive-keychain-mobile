import React from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';

export default (eventReceived: any) => {
  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('command_event', (event) => {
      if (event && Object.entries(event).length >= 1) {
        eventReceived.current = event;
      }
    });
    return () => {
      eventListener.remove();
    };
  }, [eventReceived]);
};
