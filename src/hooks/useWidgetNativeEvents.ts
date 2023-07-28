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

  // const handleEventListener = (event: any) => {
  //   const mode = process.env.NODE_ENV;
  //   // if (mode === 'development') {
  //   //   console.log({event});
  //   // }

  //   if (event && Object.entries(event).length >= 1) {
  //     return event;
  //   }

  //   // if (event && event.currency) {
  //   //   const {currency: command} = event;
  //   //   if (command === 'update_values') {
  //   //     await WidgetUtils.sendWidgetData();
  //   //   }
  //   // }
  //   // if (event & event.navigateTo) {
  //   //   const {navigateTo} = event;
  //   //   if (mode === 'development') {
  //   //     console.log({navigateTo});
  //   //   }
  //   // }
  // };
  // console.log({eventReceived});
  // return eventReceived;
};
