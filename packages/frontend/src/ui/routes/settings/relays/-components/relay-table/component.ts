import Component from 'sparkles-component';
import StoreService from 'ember-data/store';
import { service } from '@ember-decorators/service';

import Relay from 'emberclear/data/models/relay';

interface IArgs {
  relays: Relay[];
}

export default class RelayTable extends Component<IArgs> {
  @service store!: StoreService;

  remove(relay: Relay) {
    relay.deleteRecord();
    relay.save();
  }

  async makeDefault(relay: Relay) {
    relay.set('priority', 1);
    relay.save();

    const relays: Relay[] = await this.store.findAll('relay');

    let nextHighestPriority = 2;

    relays
      .toArray()
      .sort(r => r.priority)
      .forEach((nonDefaultRelay) => {
        if (nonDefaultRelay.id === relay.id) return;

        nonDefaultRelay.set('priority', nextHighestPriority);
        nonDefaultRelay.save();
        nextHighestPriority++;
      });
  }
}
