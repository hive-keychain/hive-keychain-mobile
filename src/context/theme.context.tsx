import {Dispatch, SetStateAction, createContext, useContext} from 'react';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum ThemeOpacity {
  dark = '33',
  light = '2b',
}

export type ThemeContextType = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.DARK,
  setTheme: (theme) => {
    console.log('no theme provider');
  },
  toggleTheme: () => {
    console.log('no theme provider');
  },
});
export const useThemeContext = () => useContext(ThemeContext);
