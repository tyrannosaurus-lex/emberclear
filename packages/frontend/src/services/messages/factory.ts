import DS from 'ember-data';
import Service from '@ember/service';
import { service } from '@ember-decorators/service';

import IdentityService from 'emberclear/services/identity/service';
import { TYPE, TARGET } from 'emberclear/src/data/models/message';
import Identity from 'emberclear/src/data/models/identity/model';

export default class MessageFactory extends Service {
  @service store!: DS.Store;
  @service identity!: IdentityService;

  buildChat(text: string) {
    return this._build({
      body: text,
      type: TYPE.CHAT
    });
  }

  buildEmote(text: string) {
    return this._build({
      body: text,
      type: TYPE.EMOTE
    });
  }

  buildWhisper(text: string, to: Identity) {
    return this._build({
      body: text,
      to: to.uid,
      target: TARGET.WHISPER
    });
  }

  _build(attributes = {}) {
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
