// Define widely used spacing throughout the App

import {getSpaceMultiplier} from './sizeAdjuster';
import {SMALLEST_SCREEN_HEIGHT_SUPPORTED} from './typography';

// Usage : In stylesheet : {..., marginLeft:getSpacing(widht,height).mainMarginHorizontal }
// If you need a static value, no need to pass width and height  {..., marginLeft:getSpacing().mainFixedMargin }

// Convention : name spacings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

export const PADDINGLEFTMAINMENU = 12;
export const LABELINDENTSPACE = 14;
export const TOPCONTAINERSEPARATION = 15;
export const STACK_HEADER_HEIGHT = 55;
export const MIN_SEPARATION_ELEMENTS = 4;

export const getSpacing = (width = 0, height = 0) => {
  return {
    mainMarginHorizontal: 0.05 * width, //dynamic
    mainmarginHorizontalExtra: 0.09 * width,
    mainFixedMargin: 100, //static
  };
};

export const getElementHeight = (height: number) => {
  return height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? 45 : 50;
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
