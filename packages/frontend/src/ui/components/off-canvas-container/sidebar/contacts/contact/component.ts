import Component, { tracked } from 'sparkles-component';
import { Registry } from '@ember/service';
import { service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';
import { reads, gt } from '@ember-decorators/object/computed';
import { task } from 'ember-concurrency-decorators';

import Identity, { STATUS } from 'emberclear/src/data/models/identity/model';
import Message, { TARGET } from 'emberclear/src/data/models/message';
import SettingsService from 'emberclear/src/services/settings';

interface IArgs {
  contact: Identity;
}

export default class SidebarContact extends Component<IArgs> {
  @service router!: Registry['router'];
  @service store;
  @service settings!: SettingsService;

  @reads('settings.hideOfflineContacts') hideOfflineContacts!: boolean;

  @computed('router.currentURL')
  get isActive() {
    const { contact } = this.args;

    return this.router.currentURL.includes(contact.id);
  }

  @computed('args.contact.onlineStatus')
  get isContactVisible() {
    const { contact } = this.args;

    // always show if online
    if (contact.onlineStatus !== STATUS.OFFLINE) {
      return true;
    }

    // always show if there are unread messages
    if (this.hasUnread) {
      return true;
    }

    // do not show offline contacts if configured that way
    return !this.hideOfflineContacts;
  }

  @gt('numberUnread', 0) hasUnread!: boolean;

  @tracked messages: Message[] = [];

  @computed('messages.@each.unread')
  get numberUnread() {
    const { contact } = this.args;

    // TODO: add check for read status
    const messages = this.messages.filter(m => {
      return (
        m.from === contact.id
        && m.unread
        && m.target !== TARGET.NONE
        && m.target !== TARGET.MESSAGE
      );
    });

    return messages.length;
  }

  // TODO: use requestIdleCallback to work on counting the unread messages
  //       only when there is nothing else to do
  didInsertElement() {
    this.findRelevantMessages.perform();
  }

  @task * findRelevantMessages() {
    const messages = yield this.store.findAll('message');

    this.messages = messages;
  }
}
