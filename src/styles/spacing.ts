// Define widely used spacing throughout the App

import {getSpaceMultiplier} from './sizeAdjuster';
import {SMALLEST_SCREEN_WIDTH_SUPPORTED} from './typography';

// Usage : In stylesheet : {..., marginLeft:getSpacing(widht,height).mainMarginHorizontal }
// If you need a static value, no need to pass width and height  {..., marginLeft:getSpacing().mainFixedMargin }

// Convention : name spacings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

export const PADDING_LEFT_MAIN_MENU = 12;
export const LABEL_INDENT_SPACE = 14;
export const TOP_CONTAINER_SEPARATION = 15;
export const STACK_HEADER_HEIGHT = 55;
export const MIN_SEPARATION_ELEMENTS = 4;
export const MARGIN_PADDING = 16;
export const CONTENT_MARGIN_PADDING = 10;
export const MARGIN_LEFT_RIGHT_MIN = 8;

export const getSpacing = (width = 0, height = 0) => {
  return {
    mainMarginHorizontal: 0.05 * width, //dynamic
    mainmarginHorizontalExtra: 0.09 * width,
    mainFixedMargin: 100, //static
  };
};

export const getElementHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 45 : 50;
};

export const getSpaceAdjustMultiplier = (
  width: number,
  height: number,
  spaceBase = 0.02,
) => {
  const adjustMultiplier: number = getSpaceMultiplier(width, height);
  return {
    spaceBase,
    adjustMultiplier,
    multiplier: spaceBase * adjustMultiplier,
  };
};
