import DS from 'ember-data';
import Identity from '../identity/model';
const { attr } = DS;

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export default class MeModel extends Identity implements Partial<KeyPair> {
  @attr() privateKey!: Uint8Array;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  interface ModelRegistry {
    me: MeModel;
  }
}
