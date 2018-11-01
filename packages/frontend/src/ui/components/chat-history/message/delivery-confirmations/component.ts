import Component from 'sparkles-component';
import { computed } from '@ember-decorators/object';

import Message from 'emberclear/src/data/models/message';

interface IArgs {
  message: Message;
}

export default class extends Component<IArgs> {

  @computed('message.deliveryConfirmations')
  get hasDeliveryConfirmations() {
    const confirmations = this.args.message.deliveryConfirmations;

    return confirmations && confirmations.length > 0;
  }
}
