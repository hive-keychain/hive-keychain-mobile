import {Theme} from 'src/context/theme.context';

// Define widely used colors throughout the App

// Usage : In stylesheet : {..., color:getColors().primary }

// Convention : name colors by what they do, not according to their color. RED is not a good name since it might change
// depending on the style. settingButtonPrimary is a good name, since it describes well where the color is being used.
// It's okay to have several time the same color with different names since the equivalence between the themes will not
// always been the same.

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//TODO : Change primary, this was just put here as an example

//Colors
export const NEUTRAL_WHITE_COLOR = '#FFF';
export const PRIMARY_RED_COLOR = '#E31337';
export const BRIGTHER_PRIMARY_RED = '#f52c4e';
export const INDICATOR_ACTIVE_COLOR = PRIMARY_RED_COLOR;
export const INDICATOR_INACTIVE_COLOR = '#ffffffd4';

export const RED_SHADOW_COLOR = 'rgba(227, 19, 55, 1)';
export const BACKGROUNDITEMDARKISH = '#293144';
export const BACKGROUNDLIGHTVARIANTLIGHTBLUE = '#E6EEF6';
export const BACKGROUNDDARKBLUE = '#212838';

export const getColors = (theme: Theme) => {
  return {
    primaryText: theme === Theme.LIGHT ? '#484848' : '#FFF',
    secondaryText: theme === Theme.LIGHT ? '#212838' : '#FFF',
    primaryBackground: theme === Theme.LIGHT ? '#E5EDF5' : '#212838',
    contrastBackground: theme === Theme.LIGHT ? '#212838' : '#E5EDF5',
    menuHamburguerBg: theme === Theme.LIGHT ? '#FFF' : '#212838',
    gradientShapes:
      theme === Theme.LIGHT
        ? ['rgba(33, 40, 56, 0.15)', 'rgba(33, 40, 56, 0.15)', '#212838']
        : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.15)', '#FFF'],
    cardBorderColor: theme === Theme.LIGHT ? '#EAEAEA' : '#364360',
    cardBorderColorContrast: theme === Theme.LIGHT ? '#EAEAEA' : '#364360',
    borderContrast: theme === Theme.LIGHT ? '#212838' : '#FFF',
    primaryRedShape:
      theme === Theme.LIGHT ? BRIGTHER_PRIMARY_RED : PRIMARY_RED_COLOR,
    cardBgColor: theme === Theme.LIGHT ? '#E5EDF5' : '#293144',
  };
};
