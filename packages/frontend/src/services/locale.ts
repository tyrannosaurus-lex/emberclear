import Service from '@ember/service';
import { service } from '@ember-decorators/service';
import IntlService from 'ember-intl/services/intl';

import { disableInFastboot, syncToLocalStorage } from 'emberclear/src/utils/decorators';

const DEFAULT_LOCALE = 'en-us';

export default class LocaleService extends Service {
  @service intl!: IntlService;

  @disableInFastboot
  @syncToLocalStorage
  get currentLocale() {
    return DEFAULT_LOCALE;
  }

  async setLocale(locale: string) {
    this.set('currentLocale', locale);

    if (locale === DEFAULT_LOCALE) {
      return this.intl.setLocale([locale]);
    }

    const request = await fetch(`/translations/${locale}.json`);
    const translations = await request.json();

    this.intl.addTranslations(locale, translations);
    this.intl.setLocale([ locale ]);
  }

}
