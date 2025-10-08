import {getLocales} from 'expo-localization';
import {I18n, Scope, TranslateOptions} from 'i18n-js';
import de from 'locales/de.json';
import en from 'locales/en.json';
import es from 'locales/es.json';
import fr from 'locales/fr.json';
import id from 'locales/id.json';
import pt from 'locales/pt.json';

const locales = getLocales();

export const getMainLocale = () => {
  return locales[0].languageCode!;
};

const i18n = new I18n({en, fr, es, pt, de, id});

if (Array.isArray(locales)) {
  console.log('getMainLocale', getMainLocale());
  i18n.locale = getMainLocale();
}

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const translate = (scope: Scope, options?: TranslateOptions) =>
  i18n.t(scope, options);
export default I18n;
