import Component from '@ember/component';
import { EKMixin, keyDown, EKOnInsertMixin } from 'ember-keyboard';

const KeyboardAwareComponent = Component.extend(EKMixin, EKOnInsertMixin);

export default class KeyboardPress extends KeyboardAwareComponent {
  didInsertElement() {
    this._super(...arguments);

    this.on(keyDown(this.key), this.onPress);
  }
}
