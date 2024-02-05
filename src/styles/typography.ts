// Define widely used text styles throughout the App

import {StyleProp, TextStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from './colors';

// Usage : In stylesheet, you can compound several styles : {thisTextField:{...Typography.mainHeader,Typography.underlined }}

// Convention : name typography settings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

export enum FontPoppinsName {
  ITALIC = 'Poppins-Italic',
  SEMI_BOLD = 'Poppins-SemiBold',
  REGULAR = 'Poppins-Regular',
  MEDIUM = 'Poppins-Medium',
  BOLD = 'Poppins-Bold',
  BLACK = 'Poppins-Black',
}

export enum FontJosefineSansName {
  BOLD = 'JosefinSans-Bold',
  REGULAR = 'JosefinSans-Regular',
  MEDIUM = 'JosefinSans-Medium',
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
};

export const headerH2Primary: TextStyle = {
  fontSize: FontSize.h2,
  fontFamily: FontPoppinsName.BOLD,
};

export const headerH3Primary: TextStyle = {
  fontSize: FontSize.h3,
  fontFamily: FontPoppinsName.BOLD,
};

export const headlines_primary_headline_1: TextStyle = {
  fontSize: FontSize.h4,
  fontFamily: FontPoppinsName.SEMI_BOLD,
};

export const headlines_primary_headline_2: TextStyle = {
  fontSize: 20,
  fontFamily: FontPoppinsName.SEMI_BOLD,
};

export const body_primary_body_1: TextStyle = {
  fontSize: 15,
  fontFamily: FontPoppinsName.MEDIUM,
};

export const body_primary_body_2: TextStyle = {
  fontSize: 12,
  fontFamily: FontPoppinsName.BOLD,
};

export const body_primary_body_3: TextStyle = {
  fontSize: 15,
  fontFamily: FontPoppinsName.REGULAR,
};

export const title_primary_title_1: TextStyle = {
  fontSize: 15,
  fontFamily: FontPoppinsName.REGULAR,
};

export const title_primary_body_2: TextStyle = {
  fontSize: 12,
  fontFamily: FontPoppinsName.SEMI_BOLD,
};

export const title_primary_body_3: TextStyle = {
  fontSize: 15,
  fontFamily: FontPoppinsName.SEMI_BOLD,
};

export const title_secondary_title_2: TextStyle = {
  fontSize: FontSize.h3,
  fontFamily: FontJosefineSansName.BOLD,
};

export const title_secondary_body_2: TextStyle = {
  fontSize: 20,
  fontFamily: FontJosefineSansName.REGULAR,
};

export const title_secondary_body_3: TextStyle = {
  fontSize: 12,
  fontFamily: FontJosefineSansName.MEDIUM,
};

export const button_link_primary_medium: TextStyle = {
  fontSize: 15,
  fontFamily: FontPoppinsName.MEDIUM,
};

export const button_link_primary_small: TextStyle = {
  fontSize: 13,
  fontFamily: FontPoppinsName.REGULAR,
};

export const fields_primary_text_1: TextStyle = {
  fontSize: 12,
  fontFamily: FontPoppinsName.REGULAR,
};

export const fields_primary_text_2: TextStyle = {
  fontSize: 10,
  fontFamily: FontPoppinsName.REGULAR,
};

export const underlined: TextStyle = {
  textDecorationStyle: 'solid',
  textDecorationLine: 'underline',
};

export const SMALLEST_SCREEN_HEIGHT_SUPPORTED = 600;

export const getFontSizeSmallDevices = (
  height: number,
  currentFontSize: number,
  smallestScreenHeight = SMALLEST_SCREEN_HEIGHT_SUPPORTED,
) => {
  return height <= smallestScreenHeight
    ? currentFontSize * 0.7
    : currentFontSize;
};

export const getFormFontStyle = (
  height: number,
  theme: Theme,
  color?: string,
) => {
  return {
    title: {
      ...button_link_primary_medium,
      color: color ?? getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...button_link_primary_medium}.fontSize,
      ),
    } as StyleProp<TextStyle>,
    input: {
      ...body_primary_body_3,
      color: color ?? getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...body_primary_body_3}.fontSize,
      ),
    } as StyleProp<TextStyle>,
    labelInput: {
      ...title_primary_body_3,
      color: color ?? getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        height,
        {...title_primary_body_3}.fontSize,
      ),
    } as StyleProp<TextStyle>,
    infoLabel: {
      fontFamily: FontPoppinsName.ITALIC,
      color: color ?? getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(height, 15),
    } as StyleProp<TextStyle>,
  };
};
