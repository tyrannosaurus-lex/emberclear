import { isInElementWithinViewport } from 'emberclear/src/utils/dom/utils';
import Message from 'emberclear/data/models/message/model';

interface IArgs {
  selector: string;
  action: () => void;
  message: Message;
  context: any;
}

export function useReadWatcher({ action, selector, message, context }: IArgs) {
  let io: IntersectionObserver;
  let messageElement!: Element;

  /**
   * if already read, this method happens to do nothing
   * */
  let disconnect = () => {
    io && io.unobserve(messageElement);
    io && io.disconnect();
    io = undefined;

    window.removeEventListener('focus', focusHandler);
  };

  let markRead = () => {
    action();
    disconnect();
  };

  let didInsertElement = () => {
    maybeSetupReadWatcher();

    messageElement = document.getElementById(message.id)!;
  };

  let willDestroyElement = () => {};

  let focusHandler = () => {
    const container = document.querySelector(selector)!;
    const isVisible = isInElementWithinViewport(messageElement, container);

    if (isVisible) {
      markRead();
    }
  };

  let maybeSetupReadWatcher = () => {
    if (message.readAt) return;

    window.addEventListener('focus', focusHandler);
    setupIntersectionObserver();
  };

  let setupIntersectionObserver = () => {
    io = new IntersectionObserver(
      entries => {
        const isVisible = entries[0].intersectionRatio !== 0;
        const canBeSeen = !message.isSaving && document.hasFocus();

        if (isVisible && canBeSeen) {
          markRead();
        }
      },
      {
        root: document.querySelector('.messages'),
      }
    );

    io.observe(messageElement);
  };

  // install the effect
  // willDestroy in Glimmer
  context.willDestroyElement = function() {
    willDestroyElement();

    if (context.willDestroyElement) {
      context.willDestroyElement();
    }
  }.bind(context);

  didInsertElement();
}
