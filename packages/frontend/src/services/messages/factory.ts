import Service from '@ember/service';
import { service } from '@ember-decorators/service';

import IdentityService from 'emberclear/services/identity/service';
import { TYPE, TARGET } from 'emberclear/src/data/models/message';
import Identity from 'emberclear/src/data/models/identity/model';
import Channel from 'emberclear/src/data/models/channel';

export default class MessageFactory extends Service {
  @service store!: any;
  @service identity!: IdentityService;

  buildChat(text: string, to: Identity | Channel) {
    let message = this.build({
      body: text,
      type: TYPE.CHAT
    });

    if (to instanceof Identity) {
      message.set('target', TARGET.WHISPER);
      message.set('to', to.uid);
    } else if (to instanceof Channel) {
      message.set('target', TARGET.CHANNEL);
      message.set('to', to.id);
    }

    return message;
  }

  buildPing() {
    return this.build({ type: TYPE.PING });
  }

  // buildEmote(text: string) {
  //   return this._build({
  //     body: text,
  //     type: TYPE.EMOTE
  //   });
  // }

  // buildWhisper(text: string, to: Identity) {
  //   return this._build({
  //     body: text,
  //     to: to.uid,
  //     target: TARGET.WHISPER
  //   });
  // }

  private build(attributes = {}) {
    return this.store.createRecord('message', {
      sentAt: new Date(),
      from: this.identity.uid,
      sender: this.identity.record,
      ...attributes
    });
  }
}


// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'messages/factory': MessageFactory
  }
}
