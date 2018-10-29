import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';

import IdentityService from 'emberclear/services/identity/service';
import { IModel as ChatModel } from 'emberclear/ui/routes/chat/route';

import { disableInFastboot } from 'emberclear/src/utils/decorators';

interface IModelParams {
  channelId: string;
}

export default class ChatInChannelRoute extends Route {
  @service identity!: IdentityService;

  @disableInFastboot
  async model(params: IModelParams) {
    const { channelId } = params;

    const record = await this.store.findRecord('channel', channelId);
    // TODO: filter these messages down
    const chatModel = this.modelFor('chat') as ChatModel;

    return RSVP.hash({
      targetChannel: record,
      messages: chatModel.messages
    });
  }
}
