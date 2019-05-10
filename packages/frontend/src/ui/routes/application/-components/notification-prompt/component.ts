import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Notifications from 'emberclear/services/notifications/service';

export default class NotificationPrompt extends Component {
  @service notifications!: Notifications;

  @reads('notifications.showInAppPrompt') isVisible!: boolean;

  enableNotifications() {
    this.notifications.askPermission();
  }

  neverAskAgain() {
    this.notifications.isNeverGoingToAskAgain = true;
  }

  askNextTime() {
    this.notifications.isHiddenUntilBrowserRefresh = true;
  }
}
