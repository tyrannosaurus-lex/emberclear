import Component, { tracked } from 'sparkles-component';
import { service } from '@ember-decorators/service';
import { keepLatestTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import uuid from 'uuid';

interface IArgs {
  isActive: boolean;
  close: () => void;
}

export default class SearchModal extends Component<IArgs> {
  @service store;

  @tracked searchText = '';
  inputId = uuid();
  inputElement!: HTMLInputElement;

  @tracked identityResults = [];
  @tracked channelResults = [];

  didInsertElement() {
    this.search.perform('');
    this.inputElement = document.getElementById(this.inputId) as HTMLInputElement;
  }

  didUpdate() {
    this.inputElement.focus();
  }

  submitSearch() {
    this.search.perform(this.searchText);
  }

  @keepLatestTask * search(searchTerm: string) {
    yield timeout(200);

    const identityResults = yield this.store.findAll('identity', { name: searchTerm });
    const channelResults = yield this.store.findAll('channel', { name: searchTerm });

    this.identityResults = identityResults
      .filter(i => i.name.includes(searchTerm) && i.id !== 'me')
      .slice(0, 5);
    this.channelResults = channelResults
      .filter(i => i.name.includes(searchTerm))
      .slice(0, 5);
  }
}
