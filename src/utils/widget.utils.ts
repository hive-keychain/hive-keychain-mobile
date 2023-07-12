import {NativeModules} from 'react-native';

const SharedStorage = NativeModules.SharedStorage;
const group = 'group.streak';

const {RNSharedWidget} = NativeModules;

//TODO:
//  1. Follow tuts:
//    - https://www.youtube.com/watch?v=JlGFd6_QOlY
//    - https://www.youtube.com/watch?v=xGQJg31TPtU
//    - change the widget name related files & customize a bit better.
//
//  to make it dynamic and pass the data using widget.utils.ts
//  2. after making work the widget, check if needed ->
//                      - @types/react-native-shared-group-preferences
//                      - react-native-shared-group-preferences
//                      if not needed uninstall
//  3. after finishing should we try to code the IOS as well o leave this to quentin???

const sendWidgetData = async (text: string) => {
  const value = `${text} Sample Value`;
  try {
    // // iOS
    // await SharedGroupPreferences.setItem('widgetKey', {text: value}, group);
    // // Android
    // SharedStorage.set(JSON.stringify({text: value}));

    //new one
    RNSharedWidget.setData('convertorMonex', value);
  } catch (error) {
    console.log('Error sending widget data: ', {error});
  }
};

export const WidgetUtils = {sendWidgetData};
