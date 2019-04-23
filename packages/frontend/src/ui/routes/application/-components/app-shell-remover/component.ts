import Component from '@glimmer/component';

export default class extends Component {
  constructor() {
    super(...arguments);

    this.removeAppLoader();
  }

  private removeAppLoader() {
    const loader = document.querySelector('#app-loader');

    if (loader) {
      loader.remove();
    }
  }
}
