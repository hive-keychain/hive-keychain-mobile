import {Theme, useThemeContext} from 'src/context/theme.context';

// Define widely used colors throughout the App

// Usage : In stylesheet : {..., color:getColors().primary }

// Convention : name colors by what they do, not according to their color. RED is not a good name since it might change
// depending on the style. settingButtonPrimary is a good name, since it describes well where the color is being used.
// It's okay to have several time the same color with different names since the equivalence between the themes will not
// always been the same.

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//TODO : Change primary, this was just put here as an example

export const getColors = () => {
  const {theme} = useThemeContext();
  return {
    primary: theme === Theme.DARK ? '#000' : '#FFF',
  };
};
