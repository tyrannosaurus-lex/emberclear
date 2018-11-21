import Component from 'sparkles-component';
import { service } from '@ember-decorators/service';
import { reads, alias } from '@ember-decorators/object/computed';

import SidebarService from 'emberclear/services/sidebar';
import IdentityService from 'emberclear/services/identity/service';
import Modals from 'emberclear/services/modals';

export default class Sidebar extends Component {
  @service sidebar!: SidebarService;
  @service identity!: IdentityService;
  @service modals!: Modals;

  @reads('sidebar.isShown') isShown!: boolean;
  @alias('sidebar.hasUnreadAbove') hasUnreadAbove!: boolean;
  @alias('sidebar.hasUnreadBelow') hasUnreadBelow!: boolean;
  @reads('identity.name') name?: string;
  @reads('identity.isLoggedIn') isLoggedIn!: boolean;

  closeSidebar() {
    this.sidebar.hide();
  }

  toggleModal(name: string) {
    this.modals.toggle(name);
  }

  scrollDownToNearestUnread() {
    this.sidebar.set('hasUnreadBelow', false);
  }

  scrollUpToNearestUnread() {
    this.sidebar.set('hasUnreadAbove', false);
  }

}
