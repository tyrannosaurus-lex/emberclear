import { module, test } from 'qunit';
import { visit, currentURL, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import {
  clearLocalStorage,
  setupRelayConnectionMocks,
  setupCurrentUser,
  cancelLongRunningTimers,
  setupWindowNotification,
  refresh,
  getService,
  stubService,
} from 'emberclear/tests/helpers';

import NotificationService from 'emberclear/services/notification';

import { page as app } from 'emberclear/tests/helpers/pages/app';

const { notificationPrompt: prompt } = app;

module('Integration | Notifications Prompt', function(hooks) {
  setupApplicationTest(hooks);
  clearLocalStorage(hooks);
  cancelLongRunningTimers(hooks);
  setupWindowNotification(hooks);
  setupRelayConnectionMocks(hooks);
  setupCurrentUser(hooks);

  module('permission has not yet been asked for', function(hooks) {
    hooks.beforeEach(async function() {
      window.Notification = {
        permission: undefined,
      };

      await visit('/');
    });

    test('the prompt is shown', function(assert) {
      // NOTE: the prompt shows and then hides before the
      //       debugger is hit
      //       debugger;
      assert.equal(app.hasNotificationPrompt, true);
    });

    module('never ask again is clicked', function(hooks) {
      hooks.beforeEach(async function() {
        await prompt.askNever();
        await refresh();
      });

      test('the prompt is not shown', function(assert) {
        assert.equal(app.hasNotificationPrompt, false);
      });
    });

    module('ask later is clicked', function() {
      hooks.beforeEach(async function() {
        await prompt.askLater();
      });

      test('the prompt is not shown', function(assert) {
        assert.equal(app.hasNotificationPrompt, false);
      });

      module('on rerender', function(hooks) {
        hooks.beforeEach(async function() {
          await refresh();
        });

        test('the prompt is shown', function(assert) {
          assert.equal(app.hasNotificationPrompt, true);
        });
      });
    });

    module('enabled is clicked', function() {});
  });
});
