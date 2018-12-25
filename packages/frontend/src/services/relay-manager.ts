import StoreService from 'ember-data/store';
import Service from '@ember/service';
import { service } from '@ember-decorators/service';

import Relay from 'emberclear/src/data/models/relay';
import ToastService from 'emberclear/src/services/toast';
import RelayConnection from 'emberclear/src/services/relay-connection';

export default class RelayManager extends Service {
  @service toast!: ToastService;
  @service store!: StoreService;
  @service relayConnection!: RelayConnection;

  async connect() {
    const relay = await this.getRelay();

    if (!relay) {
      this.toast.error('there are no available relays.');
      return;
    }

    this.relayConnection.setRelay(relay);
    this.relayConnection.connect();
  }

  async getRelay() {
    const relays: Relay[] = this.store.findAll('relay');

    return relays.toArray().sort(r => r.priority)[0];
  }

  async getOpenGraph(url: string): Promise<OpenGraphData> {
    const baseUrl = await this.getRelay().og;
    const safeUrl = encodeURIComponent(url);
    const ogUrl = `${baseUrl}?url=${safeUrl}`;
    const response = await fetch(ogUrl, {
      credentials: 'omit',
      referrer: 'no-referrer',
      cache: 'no-cache',
      headers: {
        ['Accept']: 'application/json',
      },
    });

    const json = await response.json();

    return (json || {}).data;
  }
}

declare module '@ember/service' {
  interface Registry {
    'relay-manager': RelayManager;
  }
}
