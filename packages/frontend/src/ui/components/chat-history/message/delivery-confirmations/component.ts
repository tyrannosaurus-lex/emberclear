import Component from 'sparkles-component';
import { service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';
import { not, notEmpty } from '@ember-decorators/object/computed';

import Message from 'emberclear/src/data/models/message';
import IdentityService from 'emberclear/src/services/identity/service';

interface IArgs {
  message: Message;
}

export default class extends Component<IArgs> {
  @service identity!: IdentityService;

  @not('wasReceived') wasSent!: boolean;

  @computed('args.message.to')
  get wasReceived() {
    return this.args.message.to === this.identity.uid;
  }


  //TODO: if there are no confirmations, show an animated ellpises
  //      to simulate sending, and then either timeout,
  //      or read from the message's error property
  @notEmpty('args.message.deliveryConfirmations') hasDeliveryConfirmations!: boolean;
}
