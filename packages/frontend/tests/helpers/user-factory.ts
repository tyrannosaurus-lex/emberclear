import { DS } from 'ember-data';

import { generateAsymmetricKeys } from "emberclear/src/utils/nacl/utils";
import { toHex } from 'emberclear/src/utils/string-encoding';

import Identity from 'emberclear/data/models/identity/model';

import { getService } from './get-service';

export async function buildIdentity(name: string): Promise<Identity> {
  const store = getService<DS.Store>('store');

  const { publicKey, privateKey } = await generateAsymmetricKeys();

  const record = store.createRecord('identity', {
    id: toHex(publicKey), name, publicKey, privateKey
  });

  return record;
}

