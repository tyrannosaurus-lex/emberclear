import Component from '@ember/component';
import { EKMixin, keyDown, EKOnInsertMixin, EKOnInitMixin, EKFirstResponderOnFocusMixin } from 'ember-keyboard';

// const KeyboardAwareComponent = Component.extend(EKMixin, EKOnInsertMixin);

export default Component.extend(EKMixin,
  EKOnInitMixin,
  EKOnInsertMixin,
  EKFirstResponderOnFocusMixin, {
    keyboardPriority: 100000000000000000000000000000000000000,

  didInsertElement() {
    this._super(...arguments);

    this.on(keyDown(this.key), this.why);
  },

  why() {
    console.log('sigh');

    this.onPress();
  }
});

// export default class KeyboardPress extends KeyboardAwareComponent {
//   didInsertElement() {
//     this._super(...arguments);

//     this.on(keyDown(this.key), this.onPress);
//   }
// }
