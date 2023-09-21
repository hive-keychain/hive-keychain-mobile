// Define widely used spacing throughout the App

// Usage : In stylesheet : {..., marginLeft:getSpacing(widht,height).mainMarginHorizontal }
// If you need a static value, no need to pass width and height  {..., marginLeft:getSpacing().mainFixedMargin }

// Convention : name spacings by what they do

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//TODO : Change below, this was just put here as an example

export const getSpacing = (width = 0, height = 0) => {
  return {
    mainMarginHorizontal: 0.05 * width, //dynamic
    mainmarginHorizontalExtra: 0.09 * width,
    mainFixedMargin: 100, //static
  };
};
