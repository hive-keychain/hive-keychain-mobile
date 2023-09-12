// Define widely used text styles throughout the App

import {TextStyle} from 'react-native';
import {Colors} from 'styles';

// Usage : In stylesheet, you can compound several styles : {thisTextField:{...Typography.mainHeader,Typography.underlined }}

// Convention : name typography settings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//TODO : Change examples below, this was just put here as an example

export const mainHeader: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
};

export const underlined: TextStyle = {
  textDecorationColor: Colors.getColors().primary,
  textDecorationStyle: 'solid',
  textDecorationLine: 'underline',
};
