import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { notEmpty, and, alias, not, match } from '@ember/object/computed';

import IdentityService from 'emberclear/services/identity/service';
import RouterService from '@ember/routing/router-service';

export default class SetupController extends Controller {
  @service identity!: IdentityService;
  @service router!: RouterService;

  @notEmpty('identity.record.privateKey') identityAlreadyExists!: boolean;
  @alias('identity.allowOverride') allowOverride!: boolean;
  @not('allowOverride') intendingToReCreate!: boolean;

  @alias('router.currentRouteName') routeName!: string;
  @match('routeName', /completed/) onCompletedRoute!: boolean;
  @not('onCompletedRoute') onARouteThatWarnsOfDanger!: boolean;

  @and('intendingToReCreate', 'identityAlreadyExists', 'onARouteThatWarnsOfDanger')
  showWarning!: boolean;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'setup-controller': SetupController;
  }
}
