import {SMALLEST_SCREEN_HEIGHT_SUPPORTED} from './typography';

export const INPUT_HEIGHT_SMALL_DEVICES = 38;
export const INPUT_HEIGHT_BIGGER_DEVICES = 60;

export const getInputHeight = (height: number) => {
  return height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED
    ? INPUT_HEIGHT_SMALL_DEVICES
    : INPUT_HEIGHT_BIGGER_DEVICES;
};
