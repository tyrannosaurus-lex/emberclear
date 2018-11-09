import { module, test, skip } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import Identity from 'emberclear/src/data/models/identity/model';

import {
  clearLocalStorage,
  setupRelayConnectionMocks,
  cancelLongRunningTimers,
  setupCurrentUser,
  getStore
} from 'emberclear/tests/helpers';
import { generateAsymmetricKeys } from 'emberclear/src/utils/nacl/utils';
import { toHex } from 'emberclear/src/utils/string-encoding';

import { chat } from 'emberclear/tests/helpers/pages/chat';

module('Acceptance | Chat | Privately With', function(hooks) {
  setupApplicationTest(hooks);
  clearLocalStorage(hooks);
  setupRelayConnectionMocks(hooks);
  cancelLongRunningTimers(hooks);

  module('is logged in', function(hooks) {
    setupCurrentUser(hooks);

    module('yourself', function(hooks) {
      hooks.beforeEach(async function() {
        await visit('/chat/privately-with/me');
      });

      test('does not redirect', function(assert) {
        assert.equal(currentURL(), '/chat/privately-with/me');
      });

      test('the chat button is disabled', function(assert) {
        const result = chat.submitButton.isDisabled();

        assert.equal(result, true);
      });

      test('the textarea is not disabled', function(assert) {
        const result = chat.textarea.isDisabled();

        assert.equal(result, false);
      });

      module('text is entered', function(hooks) {
        hooks.beforeEach(async function() {
          await chat.textarea.fillIn('a message');
        });

        test('the chat button is not disabled', function(assert) {
          const result = chat.submitButton.isDisabled();

          assert.equal(result, false);
        });

        module('submit is clicked', function(hooks) {
          hooks.beforeEach(async function() {
            chat.submitButton.click();
          });

          test('message is sent', function(assert) {
            assert.expect(0);
          });

          skip('field is disabled', function(assert) {
            const result = chat.textarea.isDisabled();

            assert.equal(result, true);
          });

          test('submit is disabled', function(assert) {
            const result = chat.submitButton.isDisabled();

            assert.equal(result, true);
          });

        });

        module('enter is pressed', function(hooks) {

        });
      });
    });

    module('someone that does not exist', function(hooks) {
      hooks.beforeEach(async function() {
        await visit('/chat/privately-with/nobody');
      });

      test('redirects', function(assert) {
        assert.equal(currentURL(), '/chat');
      });

      test('a message is displayed', function(assert) {
        assert.expect(0);
      });
    });

    module('someone else', function(hooks) {
      let someone!: Identity;
      let id!: string;

      hooks.beforeEach(async function() {
        const store = getStore();
        const { publicKey, privateKey } = await generateAsymmetricKeys();
        id = toHex(publicKey);

        someone = store.createRecord('identity', {
          id,
          publicKey, privateKey
        });

        await someone.save();

        await visit(`/chat/privately-with/${id}`);
      });

      test('does not redirect', function(assert) {
        assert.equal(currentURL(), `/chat/privately-with/${id}`);
      });

      skip('a message can be sent', function(assert) {
        assert.expect(0);
      });

      skip('a message can be received', function(assert) {
        assert.expect(0);
      });
    });

  });
});
