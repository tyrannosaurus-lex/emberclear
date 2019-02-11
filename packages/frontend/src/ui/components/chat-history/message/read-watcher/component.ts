import Component from 'sparkles-component';

import Message from 'emberclear/data/models/message/model';

import { useReadWatcher } from './use-read-watcher';

interface IArgs {
  message: Message;
  markRead: () => void;
}

export default class ReadWatcher extends Component<IArgs> {
  messageElement!: Element;

  constructor(args: IArgs) {
    super(args);

    useReadWatcher(this, {
      selector: '.messages',
      action: this.args.markRead,
      message: this.args.message,
    });
  }
}
