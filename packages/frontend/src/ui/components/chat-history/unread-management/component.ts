import Component from '@glimmer/component';
import { action } from '@ember/object';

import Message from 'emberclear/src/data/models/message/model';
import Identity from 'emberclear/src/data/models/identity/model';
import Channel from 'emberclear/src/data/models/channel';

import { selectUnreadDirectMessages, markAsRead } from 'emberclear/src/data/models/message/utils';
import { scrollIntoViewOfParent, isInElementWithinViewport } from 'emberclear/src/utils/dom/utils';

interface IArgs {
  to: Identity | Channel;
  messages: Message[];
}

export default class UnreadManagement extends Component<IArgs> {
  messagesElement!: HTMLElement;

  @action findMessagesContainer() {
    this.messagesElement = document.querySelector('.messages') as HTMLElement;
  }

  // @computed('to.id', 'args.messages.@each.unread')
  get unreadMessages() {
    const { to, messages } = this.args;
    const unread = selectUnreadDirectMessages(messages, to.id);

    return unread;
  }

  get numberOfUnread() {
    return this.unreadMessages.length;
  }

  get hasUnreadMessages() {
    return this.numberOfUnread > 0;
  }

  get shouldRender() {
    if (!this.hasUnreadMessages) return false;

    return this.hasUnreadOffScreen();
  }

  get firstUnreadMessage(): Message | undefined {
    return this.unreadMessages[0];
  }

  get dateOfFirstUnreadMessage(): Date | undefined {
    if (this.firstUnreadMessage) {
      return this.firstUnreadMessage.receivedAt;
    }
  }

  markAllAsRead() {
    this.unreadMessages.forEach(message => {
      markAsRead(message);
    });
  }

  scrollToFirstUnread() {
    if (this.firstUnreadMessage) {
      const firstUnread = document.getElementById(this.firstUnreadMessage.id)!;

      scrollIntoViewOfParent(this.messagesElement, firstUnread);
    }
  }

  private hasUnreadOffScreen() {
    if (this.firstUnreadMessage) {
      const firstUnread = document.getElementById(this.firstUnreadMessage.id);

      if (firstUnread) {
        const isOnScreen = isInElementWithinViewport(firstUnread, this.messagesElement);

        return !isOnScreen;
      }
    }

    return false;
  }
}
