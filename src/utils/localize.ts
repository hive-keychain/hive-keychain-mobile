/* istanbul ignore file */
import I18n from 'i18n-js';
import en from 'locales/en.json';
import fr from 'locales/fr.json';
import * as RNLocalize from 'react-native-localize';

const locales = RNLocalize.getLocales();

export const getMainLocale = () => {
  return locales[0].languageTag;
};
if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  fr,
};
export const translate = I18n.t;
export default I18n;
