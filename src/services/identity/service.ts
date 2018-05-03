import DS from 'ember-data';
import Service from '@ember/service';

import { service } from '@ember-decorators/service';

import KeyGeneration from 'emberclear/services/key-generation';
import Identity from 'emberclear/data/models/identity';


// TODO: use actual model, and use this just for proxying to that
export default class IdentityService extends Service {
  @service('key-generation') keyGeneration!: KeyGeneration;
  // @service('store') store!: DS.Store;

  name?: string;
  publicKey?: string;
  privateKey?: string;

  create(name: string) {
    const { publicKey, privateKey } = this.keyGeneration.newKeyPair();

    // this.store.createRecord('identity', {
    //   id: 'me',
    //   name,
    //   privateKey,
    //   publicKey
    // });
  }

  exists(): boolean {
    const identity = this._identity();

    if (!identity) return false;

    const key = identity.get('privateKey');

    return ((key || '').length > 0);
  }

  load() {
    const json = JSON.parse(localStorage.identity);

    this.store.createRecord('identity', json);
  }

  dump() {
    const identity = this._identity();

    if (!identity) return;

    const json = identity.serialize({ includeId: true });

    localStorage.identity = json;
  }

  _identity(): Identity | null {
    return this.store.peekRecord('identity', 'me');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'identity': IdentityService;
  }
}