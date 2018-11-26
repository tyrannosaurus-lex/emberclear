import Component, { tracked } from 'sparkles-component';
import { service } from '@ember-decorators/service';
import { reads } from '@ember-decorators/object/computed';
import LocaleService from 'emberclear/src/services/locale';


export default class LocaleSwitcher extends Component {
  @service locale!: LocaleService;

  options: any;
  @tracked isActive = false;

  constructor() {
    super(...arguments);

    this.options = [
      { locale: 'en-us', label: 'English' },
      { locale: 'de-de', label: 'German' },
      { locale: 'fr-fr', label: 'French'},
      { locale: 'es-es', label: 'Spanish' },
    ];
  }

  @reads('locale.currentLocale') currentLocale!: string;

  toggleMenu() {
    this.isActive = !this.isActive;
}

  chooseLanguage(locale: string) {
    this.locale.setLocale(locale);
  }
}
