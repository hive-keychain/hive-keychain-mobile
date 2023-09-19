// Define widely used text styles throughout the App

import {TextStyle} from 'react-native';

// Usage : In stylesheet, you can compound several styles : {thisTextField:{...Typography.mainHeader,Typography.underlined }}

// Convention : name typography settings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//TODO : Change examples below, this was just put here as an example

export enum FontPoppinsName {
  ITALIC = 'Poppins-Italic',
  SEMI_BOLD = 'Poppins-SemiBold',
  REGULAR = 'Poppins-Regular',
  MEDIUM = 'Poppins-Medium',
  BOLD = 'Poppins-Bold',
  BLACK = 'Poppins-Black',
}

export enum FontSize {
  h1 = 40,
  h2 = 34,
  h3 = 28,
  h4 = 22,
}

export const mainHeader: TextStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  //TODO clean up
  // textDecorationColor: Colors.getColors().primaryText,
};

export const headline_1: TextStyle = {
  fontSize: FontSize.h4,
  fontFamily: FontPoppinsName.SEMI_BOLD,
};

export const underlined: TextStyle = {
  textDecorationStyle: 'solid',
  textDecorationLine: 'underline',
};
