import Component, { tracked } from 'sparkles-component';
import { Registry } from '@ember/service';
import { service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';
import { reads, gt } from '@ember-decorators/object/computed';
import { task } from 'ember-concurrency-decorators';
import uuid from 'uuid';

import Identity, { STATUS } from 'emberclear/src/data/models/identity/model';
import Message, { TARGET } from 'emberclear/src/data/models/message';
import SettingsService from 'emberclear/src/services/settings';
import SidebarService from 'emberclear/src/services/sidebar';

interface IArgs {
  contact: Identity;
}

export default class SidebarContact extends Component<IArgs> {
  @service router!: Registry['router'];
  @service store;
  @service settings!: SettingsService;
  @service sidebar!: SidebarService;

  io?: IntersectionObserver;

  unreadElementId = uuid();

  @reads('settings.hideOfflineContacts') hideOfflineContacts!: boolean;

  @computed('router.currentURL')
  get isActive() {
    const { contact } = this.args;

    return this.router.currentURL.includes(contact.id);
  }

  @computed('args.contact.onlineStatus', 'hideOfflineContacts')
  get shouldBeRendered() {
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

  didInsertElement() {
    window.requestIdleCallback(() => this.findRelevantMessages.perform());
  }

  @task * findRelevantMessages() {
    const messages = yield this.store.findAll('message');

    this.messages = messages;
    window.requestIdleCallback(() => this.setupIntersectionObserver());
  }

  private setupIntersectionObserver() {
    if (!this.shouldBeRendered) return;
    if (!this.hasUnread) return;
    if (this.io) return;

    // determine if the unread is visible, above the viewport or below
    const io = new IntersectionObserver(entries => {
      const intersectionEntry = entries[0];
      const { boundingClientRect, rootBounds } = intersectionEntry;
      const isBelow = boundingClientRect.top > rootBounds.bottom;
      const isAbove = boundingClientRect.top < rootBounds.top;

      if (isBelow) {
        this.sidebar.set('hasUnreadBelow', true);
      }

      if (isAbove) {
        this.sidebar.set('hasUnreadAbove', true);
      }
    }, {
      root: document.querySelector('.sidebar-wrapper aside.menu'),
    });

    io.observe(document.getElementById(this.unreadElementId)!);

    this.io = io;
  }
}
