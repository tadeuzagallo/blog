import en from '../i18n/en.json';

const langs = {
  en,
};

export default function i18n(lang) {
  const dict = langs[lang];
  if (!dict)
    throw new Error(`Unsupported language: ${lang}`);
  return { t: key => dict[key] };
}
