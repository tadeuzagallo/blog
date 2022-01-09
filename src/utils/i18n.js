import en from '../i18n/en.json';
import pt from '../i18n/pt.json';

const langs = {
  en,
  pt,
};

export default function i18n(lang) {
  const dict = langs[lang];
  if (!dict)
    throw new Error(`Unsupported language: ${lang}`);
  return { t: key => dict[key] };
}
