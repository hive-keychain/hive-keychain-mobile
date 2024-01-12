import {SMALLEST_SCREEN_HEIGHT_SUPPORTED} from './typography';

export const WIDTH_SMALL_DEVICES = 20;
export const HEIGHT_SMALL_DEVICES = 20;

export const getIconDimensions = (height: number) => {
  return height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED
    ? {width: WIDTH_SMALL_DEVICES, height: HEIGHT_SMALL_DEVICES}
    : {width: 30, height: 30};
};
