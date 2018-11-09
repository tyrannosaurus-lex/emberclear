import {
  find, click, fillIn, findAll,
} from '@ember/test-helpers';

export const chat = {
  textarea: {
    fillIn: (text: string) => fillIn('[data-test-chat-entry]', text),
    isDisabled: () => !!find('[data-test-chat-entry][disabled]'),
  },

  submitButton: {
    click: () => click('[data-test-chat-submit]'),
    isDisabled: () => !!find('[data-test-chat-submit][disabled]'),
  },

  messages: {
    all: () => findAll('[data-test-chat-message]'),
  },

};


