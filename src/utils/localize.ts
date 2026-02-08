import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocales} from 'expo-localization';
import {I18n, Scope, TranslateOptions} from 'i18n-js';
import de from 'locales/de.json';
import en from 'locales/en.json';
import es from 'locales/es.json';
import fr from 'locales/fr.json';
import id from 'locales/id.json';
import pt from 'locales/pt.json';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';

const locales = getLocales();

export const getMainLocale = () => {
  return locales[0].languageCode!;
};

export const getLocalesList = () => {
  return [
    {label: 'English', value: 'en', icon: '🇺🇸'},
    {label: 'Français', value: 'fr', icon: '🇫🇷'},
    {label: 'Español', value: 'es', icon: '🇪🇸'},
    {label: 'Português', value: 'pt', icon: '🇵🇹'},
    {label: 'Deutsch', value: 'de', icon: '🇩🇪'},
    {label: 'Indonesia', value: 'id', icon: '🇮🇩'},
  ];
};

const listeners = new Set<() => void>();
export const onLocaleChange = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const notifyLocaleChange = () => {
  listeners.forEach((l) => l());
};

const i18n = new I18n({en, fr, es, pt, de, id});

export const setLocale = () => {
  if (Array.isArray(locales)) {
    const previousLocale = i18n.locale;
    AsyncStorage.getItem(KeychainStorageKeyEnum.LANGUAGE).then((value) => {
      if (!value || value === 'DEFAULT') {
        i18n.locale = getMainLocale();
      } else {
        i18n.locale = value;
      }
      if (previousLocale !== i18n.locale) {
        notifyLocaleChange();
      }
    });
  }
};

setLocale();

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const translate = (scope: Scope, options?: TranslateOptions) =>
  i18n.t(scope, options);
export default i18n;
