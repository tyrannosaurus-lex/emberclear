import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import { reads } from '@ember-decorators/object/computed';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

import IdentityService from 'emberclear/src/services/identity/service';
import Sidebar from 'emberclear/src/services/sidebar/service';

const TouchComponent = Component.extend(RecognizerMixin, { recognizers: 'pan' });

export default class OffCanvasContainer extends TouchComponent {
  @service identity!: IdentityService;
  @service sidebar!: Sidebar;

  @reads('identity.isLoggedIn')
  isLoggedIn!: boolean;

  openDetectionWidth = 15;
  isDraggingOpen = false;

  @action
  toggleSidebar(this: OffCanvasContainer) {
    this.sidebar.toggle();
  }

  panStart(e) {
    console.log(e);

    this.sidebar.toggle();
  }

  didPanStart(e) {

  }

  didPan(e) {

  }

  didPanEnd(e) {

  }
}
