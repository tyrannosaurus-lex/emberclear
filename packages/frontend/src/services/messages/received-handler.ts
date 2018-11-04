import DS from 'ember-data';
import Service from '@ember/service';
import { service } from '@ember-decorators/service';

import Message, { TYPE } from 'emberclear/src/data/models/message';
import AutoResponder from 'emberclear/src/services/messages/auto-responder';


export default class ReceivedHandler extends Service {
  @service store!: DS.Store;
  @service('messages/auto-responder') autoResponder!: AutoResponder;

  async handle(message: Message) {
    const type = message.type;

    switch (type) {
      case TYPE.DELIVERY_CONFIRMATION:
        return this.handleDeliveryConfirmation(message);
      case TYPE.CHAT:
        return this.handleChat(message);
      case TYPE.EMOTE:
        return this.handleChat(message);
      default:
        console.info('Unrecognized message to handle...');
        return message;
    }
  }

  private async handleDeliveryConfirmation(message: Message) {
    const targetMessage = await this.store.findRecord('message', to);

    // targetMessage.set('confirmationFor', message);
    message.deliveryConfirmations!.pushObject(targetMessage);

    // blocking?
    await message.save();

    return message;
  }

  private async handleChat(message: Message) {
    this.autoResponder.messageReceived(message);

    await message.save();

    return message;
  }
}

declare module '@ember/service' {
  interface Registry {
    'messages/received-handler': ReceivedHandler
  }
}
