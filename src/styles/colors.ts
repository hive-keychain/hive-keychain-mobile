import {StatusBarStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';

// Define widely used colors throughout the App

// Usage : In stylesheet : {..., color:getColors().primary }

// Convention : name colors by what they do, not according to their color. RED is not a good name since it might change
// depending on the style. settingButtonPrimary is a good name, since it describes well where the color is being used.
// It's okay to have several time the same color with different names since the equivalence between the themes will not
// always been the same.

// /!\ Never change a value, it might affect other part of the App, create a new variable instead

//Colors
export const NEUTRAL_WHITE_COLOR = '#FFF';
export const PRIMARY_RED_COLOR = '#E31337';
export const DARKER_RED_COLOR = '#A5112C';
export const BRIGTHER_PRIMARY_RED = '#f52c4e';
export const INDICATOR_ACTIVE_COLOR = PRIMARY_RED_COLOR;
export const INDICATOR_INACTIVE_COLOR = '#ffffffd4';

export const RED_SHADOW_COLOR = 'rgba(227, 19, 55, 1)';
export const BACKGROUNDITEMDARKISH = '#293144';
export const BACKGROUNDLIGHTVARIANTLIGHTBLUE = '#E6EEF6';
export const BACKGROUNDDARKBLUE = '#212838';
export const LINESTROKESEPARATOR = '#EDF4FC';
export const SECONDLINESTROKESEPARATOR = '#EAEAEA';
export const DARKBLUELIGHTER = '#364360';
export const BORDERWHITISH = '#EDEDED';
export const GREENINFO = '#02B15A';
export const OVERLAYICONBGCOLOR = 'rgba(255, 255, 255, 0.17)';
export const HIVEICONBGCOLOR = '#FDEBEE';
export const HBDICONBGCOLOR = '#DFF6E1';
export const ICONGRAYBGCOLOR = 'rgba(255, 255, 255, 0.17)';
export const GREEN_SUCCESS = '#2aa034';
export const BLACK_OVERLAY_TRANSPARENT = 'rgba(0, 0, 0, 0.75)';

export const getColors = (theme: Theme) => {
  return {
    primaryText: theme === Theme.LIGHT ? '#484848' : '#FFF',
    secondaryText: theme === Theme.LIGHT ? '#212838' : '#FFF',
    secondaryTextInverted: theme === Theme.DARK ? '#212838' : '#FFF',
    symbolText: theme === Theme.LIGHT ? '#3D3D3D' : '#FFF',
    totalDisplayTextAmount: theme === Theme.LIGHT ? '#242424' : '#FFF',
    quinaryText: theme === Theme.LIGHT ? '#7F8288' : '#FFF',
    senaryText:
      theme === Theme.LIGHT
        ? 'rgba(33, 40, 56, 0.80)'
        : 'rgba(255, 255, 255, 0.80)',
    septenaryText: theme === Theme.LIGHT ? '#868D99' : '#FFF',
    primaryBackground: theme === Theme.LIGHT ? '#E5EDF5' : '#212838',
    contrastBackground: theme === Theme.LIGHT ? '#212838' : '#E5EDF5',
    separatorBgColor: theme === Theme.LIGHT ? '#F7F8F9' : '#364360',
    menuHamburguerBg: theme === Theme.LIGHT ? '#FFF' : '#212838',
    gradientShapes:
      theme === Theme.LIGHT
        ? ['rgba(33, 40, 56, 0.15)', 'rgba(33, 40, 56, 0.15)', '#212838']
        : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.15)', '#FFF'],
    cardBorderColorJustDark: theme === Theme.DARK ? '#364360' : '#ffffff00',
    cardBorderColor: theme === Theme.LIGHT ? '#EAEAEA' : '#364360',
    cardBorderColorContrast: theme === Theme.LIGHT ? '#EAEAEA' : '#364360',
    secondaryCardBorderColor: theme === Theme.LIGHT ? '#B4C0CF' : '#364360',
    tertiaryCardBorderColor: theme === Theme.LIGHT ? '#C7C5DE' : '#364360',
    quaternaryCardBorderColor: theme === Theme.LIGHT ? '#E1E8EF' : '#364360',
    quinaryCardBorderColor: theme === Theme.LIGHT ? BORDERWHITISH : '#FFF',
    senaryCardBorderColor: theme === Theme.LIGHT ? '#FFF' : '#344360',
    septenaryCardBorderColor:
      theme === Theme.LIGHT ? BACKGROUNDLIGHTVARIANTLIGHTBLUE : '#364360',
    walletUserPickerBorder: theme === Theme.LIGHT ? '#FFF' : '#364360',
    borderContrast: theme === Theme.LIGHT ? '#212838' : '#FFF',
    primaryRedShape:
      theme === Theme.LIGHT ? BRIGTHER_PRIMARY_RED : PRIMARY_RED_COLOR,
    cardBgColor: theme === Theme.LIGHT ? '#E5EDF5' : '#293144',
    secondaryCardBgColor: theme === Theme.LIGHT ? '#FFF' : '#293144',
    cardBgLighter: theme === Theme.LIGHT ? '#FFF' : BACKGROUNDITEMDARKISH,
    tertiaryCardBgColor: theme === Theme.LIGHT ? '#FAFCFD' : '#293144',
    lineSeparatorStroke: theme === Theme.LIGHT ? '#EDF4FC' : '#364360',
    secondaryLineSeparatorStroke:
      theme === Theme.LIGHT
        ? 'rgba(72, 72, 72, 0.20)'
        : 'rgba(255, 255, 255, 0.20)',
    betterContrastStroke: theme === Theme.DARK ? '#FFF' : 'none',
    icon: theme === Theme.LIGHT ? PRIMARY_RED_COLOR : '#FFF',
    iconBW: theme === Theme.LIGHT ? '#1E1E1E' : '#FFF',
    secodaryIconBW: theme === Theme.LIGHT ? '#212838' : '#FFF',
    barStyle:
      theme === Theme.DARK
        ? ('light-content' as StatusBarStyle)
        : ('dark-content' as StatusBarStyle),
    labelInfoText: theme === Theme.LIGHT ? '#B6B6B6' : '#FFF',
    link: PRIMARY_RED_COLOR,
  };
};
