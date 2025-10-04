import {Dimensions} from 'src/interfaces/common.interface';
import {SMALLEST_SCREEN_WIDTH_SUPPORTED} from './typography';

export const WIDTH_SMALL_DEVICES = 20;
export const HEIGHT_SMALL_DEVICES = 20;
export const ICONMINDIMENSIONS = {width: 15, height: 15} as Dimensions;

export const getIconDimensions = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? {width: WIDTH_SMALL_DEVICES, height: HEIGHT_SMALL_DEVICES}
    : {width: 30, height: 30};
};
