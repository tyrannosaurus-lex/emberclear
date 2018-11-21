import Service from '@ember/service';

import { A } from '@ember/array';
import { service } from '@ember-decorators/service';
import { notEmpty } from '@ember-decorators/object/computed';

import { syncToLocalStorage, disableInFastboot } from 'emberclear/src/utils/decorators';

export default class Sidebar extends Service {
  @service fastboot!: FastBoot;

  unreadAbove = A();
  unreadBelow = A();

  @notEmpty('unreadAbove') hasUnreadAbove!: boolean;
  @notEmpty('unreadBelow') hasUnreadBelow!: boolean;

  @disableInFastboot
  @syncToLocalStorage
  get isShown(): boolean {
    return false;
  }

  show() {
    this.set('isShown', true);
  }

  hide() {
    this.set('isShown', false);
  }

  toggle() {
    this.set('isShown', !this.isShown);
  }

  unreadIsVisible(id: string) {
    this.unreadAbove.removeObject(id);
    this.unreadBelow.removeObject(id);
  }

  clearUnreadBelow() {
    this.unreadBelow.clear();
  }

  clearUnreadAbove() {
    this.unreadAbove.clear();
  }

}
