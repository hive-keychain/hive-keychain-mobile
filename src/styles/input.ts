import {SMALLEST_SCREEN_WIDTH_SUPPORTED} from './typography';

export const INPUT_HEIGHT_SMALL_DEVICES = 38;
export const INPUT_HEIGHT_BIGGER_DEVICES = 60;
export const INPUT_HEIGHT_CONTAINER_SMALL_DEVICES = 40;
export const INPUT_HEIGHT_CONTAINER_BIGGER_DEVICES = 50;

export const getInputHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? INPUT_HEIGHT_SMALL_DEVICES
    : INPUT_HEIGHT_BIGGER_DEVICES;
};

export const getInputContainerHeight = (screenWidth: number) => {
  return screenWidth <= SMALLEST_SCREEN_WIDTH_SUPPORTED
    ? INPUT_HEIGHT_CONTAINER_SMALL_DEVICES
    : INPUT_HEIGHT_CONTAINER_BIGGER_DEVICES;
};
