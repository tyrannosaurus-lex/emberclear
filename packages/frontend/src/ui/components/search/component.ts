import Component, { tracked } from 'sparkles-component';
import { service } from '@ember-decorators/service';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class SearchModal extends Component {
  @service store;

  searchText = '';

  @tracked identityResults = [];
  @tracked channelResults = [];

  submitSearch() {
    this.search.perform(this.searchText);
  }

  @keepLatestTask * search(searchTerm: string) {
    console.log('eh', searchTerm);
    yield timeout(200);

    const identityResults = yield this.store.findAll('identity', { name: searchTerm });
    const channelResults = yield this.store.findAll('channel', { name: searchTerm });

    this.identityResults = identityResults.filter(i => i.name.includes(searchTerm));
    this.channelResults = channelResults.filter(i => i.name.includes(searchTerm));
  }
}
