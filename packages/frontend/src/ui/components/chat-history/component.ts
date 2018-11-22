import Ember from 'ember';
import Component, { tracked } from 'sparkles-component';
import { action, computed } from '@ember-decorators/object';
import { gt } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { timeout } from 'ember-concurrency';
import { keepLatestTask } from 'ember-concurrency-decorators';

import ChatScroller from 'emberclear/services/chat-scroller';
import Message from 'emberclear/src/data/models/message/model';
import Identity from 'emberclear/src/data/models/identity/model';
import Channel from 'emberclear/src/data/models/channel';

import { selectUnreadDirectMessages } from 'emberclear/src/data/models/message/utils';

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

  @computed('args.to.id', 'args.messages.@each.unread')
  get unreadMessages() {
    const { to, messages } = this.args;
    console.log(to, messages);
    const unread = selectUnreadDirectMessages(messages, to.id);

    return unread;
  }

  @gt('unreadMessages', 0) hasUnreadMessages!: boolean;

  @action
  scrollToBottom() {
    this.chatScroller.scrollToBottom();
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
