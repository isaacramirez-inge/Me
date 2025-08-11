import en from '../i18n/en-us.json';
import es from '../i18n/es-es.json';
import sv from '../i18n/es-sv.json';

import type { Translation } from '../types/types';

export const defaultTranslation = en._info.code;
const translations: Translation[] = [en, es, sv];

export function getTranslation(code: string): Translation {
    return translations.find(t => t._info.code === code) || en;
}

export async function paths(sub: any = null) {
  return translations.map(t => ({
    params: {
      lang: t._info.code 
    }
  }));
}

export async function supportedLanguages() {
  return translations.map(t => ({
      code: t._info.code,
      name: t._info.name
    })
  );
}
