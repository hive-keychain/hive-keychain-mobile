import React from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {WidgetUtils} from 'utils/widget.utils';

export default () => {
  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('command_event', (event) => {
      handleEventListener(event);
    });
    return () => {
      eventListener.remove();
    };
  }, []);

  const handleEventListener = async (event: any) => {
    if (event && event.currency) {
      const {currency: command} = event;
      if (command === 'update_values') {
        await WidgetUtils.sendWidgetData();
      }
    }
  };
};
