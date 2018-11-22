import Ember from 'ember';
import Component, { tracked } from 'sparkles-component';
import { computed } from '@ember-decorators/object';
import { gt, reads } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { timeout } from 'ember-concurrency';
import { keepLatestTask } from 'ember-concurrency-decorators';

import ChatScroller from 'emberclear/services/chat-scroller';
import Message from 'emberclear/src/data/models/message/model';
import Identity from 'emberclear/src/data/models/identity/model';
import Channel from 'emberclear/src/data/models/channel';

import { selectUnreadDirectMessages } from 'emberclear/src/data/models/message/utils';
import { scrollIntoViewOfParent } from 'emberclear/src/utils/dom/utils';

interface IArgs {
  to: Identity | Channel;
  messages: Message[];
}

export default class ChatHistory extends Component<IArgs> {
  @service chatScroller!: ChatScroller;

  @tracked isLastVisible = true;

  didInsertElement() {
    this.autoScrollToBottom.perform();
  }

  @computed('to.id', 'messages.@each.unread')
  get unreadMessages() {
    const { to, messages } = this.args;
    const unread = selectUnreadDirectMessages(messages, to.id);
    console.log(to.id, unread.length);

    return unread;
  }

  @reads('unreadMessages.length') numberOfUnread!: number;

  @computed('unreadMessages')
  get firstUnreadMessage(): Message | undefined {
    return this.unreadMessages[0];
  }

  @computed('firstUnreadMessage')
  get dateOfFirstUnreadMessage() {
    if (this.firstUnreadMessage) {
      return this.firstUnreadMessage.receivedAt;
    }
  }

  @gt('unreadMessages.length', 0) hasUnreadMessages!: boolean;

  scrollToBottom() {
    this.chatScroller.scrollToBottom();
  }

  scrollToFirstUnread() {
    if (this.firstUnreadMessage) {
      const parent = document.querySelector('.messages')!;
      const firstUnread = document.getElementById(this.firstUnreadMessage.id)!;

      scrollIntoViewOfParent(parent, firstUnread);
    }
  }

  // This watches to see if we have scrolled up, and shows the
  // quick link to jump to the bottom.
  @keepLatestTask * autoScrollToBottom(this: ChatHistory) {

    while(true) {
      yield timeout(250);

      const isScrolledToBottom = this.chatScroller.isLastVisible();

      this.isLastVisible = isScrolledToBottom;

      // HACK: remove eventually....
      // http://ember-concurrency.com/docs/testing-debugging/
      if (Ember.testing) { return; }
    }
  }
}
