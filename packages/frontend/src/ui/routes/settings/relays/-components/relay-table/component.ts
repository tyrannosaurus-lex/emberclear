import Component from 'sparkles-component';
// import { service } from '@ember-decorators';

import Relay from 'emberclear/data/models/relay';

interface IArgs {
  relays: Relay[];
}

export default class RelayTable extends Component<IArgs> {
  // @service

  remove(relay: Relay) {
    relay.deleteRecord();
    relay.save();
  }
}
