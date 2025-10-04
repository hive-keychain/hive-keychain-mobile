import {getLocales} from 'expo-localization';
import {I18n, Scope, TranslateOptions} from 'i18n-js';
import en from 'locales/en.json';
import fr from 'locales/fr.json';

const locales = getLocales();

export const getMainLocale = () => {
  return locales[0].languageCode!;
};

const i18n = new I18n({en, fr});

if (Array.isArray(locales)) {
  i18n.locale = getMainLocale();
}

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const translate = (scope: Scope, options?: TranslateOptions) =>
  i18n.t(scope, options);
export default I18n;
