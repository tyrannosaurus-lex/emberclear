import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

import IdentityService from 'emberclear/services/identity/service';
import RouterService from '@ember/routing/router-service';

// TODO: https://adfinis-sygroup.github.io/ember-validated-form/latest/
// use a form validation library ^
export default class NameEntry extends Component {
  @service identity!: IdentityService;
  @service router!: RouterService;

  @tracked name!: string;

  get nameIsBlank(): boolean {
    return isBlank(this.name);
  }

  @action
  createIdentity() {
    this.create.perform();
  }

  @(task(function*(this: NameEntry) {
    if (this.nameIsBlank) return;
    const exists = yield this.identity.exists();

    if (!exists) {
      yield this.identity.create(this.name);
    }

    this.router.transitionTo('setup.completed');
  }).drop())
  create;
}
