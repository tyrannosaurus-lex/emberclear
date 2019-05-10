import StoreService from 'ember-data/store';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

import Identity from 'emberclear/data/models/identity/model';

import { fromHex } from 'emberclear/src/utils/string-encoding';

export default class ContactManager extends Service {
  @service store!: StoreService;

  async findOrCreate(uid: string, name: string): Promise<Identity> {
    return await run(async () => {
      try {
        // an exception thrown here is never caught
        return await this.findAndSetName(uid, name);
      } catch (e) {
        return await this.create(uid, name);
      }
    });
  }

  async findAndSetName(uid: string, name: string): Promise<Identity> {
    let record = await this.find(uid);

    // always update the name
    record.set('name', name);

    await record.save();

    return record;
  }

  async create(uid: string, name: string): Promise<Identity> {
    const publicKey = fromHex(uid);

    let record = this.store.createRecord('identity', {
      id: uid,
      publicKey,
      name,
    });

    await record.save();

    return record;
  }

  async allContacts(): Promise<Identity[]> {
    const identities = await this.store.findAll('identity');

    return identities.filter(i => i.id !== 'me');
  }

  async addContact(/* _info: any */) {
    try {
      // const existing = this.find(info.id);
      // return? error?
    } catch (e) {
      // maybe find should do the try/catching...
      // seems weird to try/catch every time we want to use find
    }
  }

  find(uid: string) {
    return this.store.findRecord('identity', uid);
  }
}

declare module '@ember/service' {
  interface Registry {
    'contact-manager': ContactManager;
  }
}
