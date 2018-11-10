import { module, test, skip } from 'qunit';
import {
  visit, currentURL, settled, waitFor,
  triggerEvent
} from '@ember/test-helpers';
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
import { app } from 'emberclear/tests/helpers/pages/app';

module('Acceptance | Chat | Privately With', function(hooks) {
  setupApplicationTest(hooks);
  clearLocalStorage(hooks);
  cancelLongRunningTimers(hooks);

  module('is logged in', function(hooks) {
    setupCurrentUser(hooks);

    module('yourself', function(hooks) {
      setupRelayConnectionMocks(hooks);

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

      test('there are 0 messages to start with', function(assert) {
        const result = chat.messages.all().length;

        assert.equal(result, 0);
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
      setupRelayConnectionMocks(hooks);

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
      });

      module('when first visiting the page', function(hooks) {
        setupRelayConnectionMocks(hooks);

        hooks.beforeEach(async function() {
          await visit(`/chat/privately-with/${id}`);
        });

        test('does not redirect', function(assert) {
          assert.equal(currentURL(), `/chat/privately-with/${id}`);
        });

        test('there are 0 messages to start with', function(assert) {
          const result = chat.messages.all().length;

          assert.equal(result, 0);
        });

      });

      module('the person is not online', function(hooks) {
        setupRelayConnectionMocks(hooks, {
          send() {
            // this error comes from the relay
            throw {
              reason: `user with id ${id} not found!`,
              to_uid: id,
            };
          }
        }, [
          { in: 'service:messages/dispatcher', as: 'relayConnection' }
        ]);

        hooks.beforeEach(async function() {
          await visit(`/chat/privately-with/${id}`);
        });

        module('a message is sent', function(hooks) {
          hooks.beforeEach(async function() {
            await chat.textarea.fillIn('a message');
            chat.submitButton.click();
          });

          module('when the message first shows up in the chat history', function(hooks) {
            hooks.beforeEach(async function() {
              await waitFor('[data-test-confirmations]');
            });

            test('the message is shown, but is waiting for a confirmation', async function(assert) {
              const messages = chat.messages.all();
              const confirmations = chat.messages.confirmationsFor(messages[0]);
              const loader = chat.messages.loaderFor(messages[0]);
              const text = confirmations.map(c => c.innerHTML).join();

              assert.ok(loader, 'a loader is rendererd');
              assert.notOk(text.includes('could not be delivered'), 'no message is rendered yet');
              await settled();
            });
          });

          module('the view has settled', function(hooks) {
            hooks.beforeEach(async function() {
              await settled();
            });

            test('there are 1 message in the history window', function(assert) {
              const result = chat.messages.all().length;

              assert.equal(result, 1);
            });

            test('the message is shown, but with an error', function(assert) {
              const messages = chat.messages.all();
              const confirmations = chat.messages.confirmationsFor(messages[0]);
              const loader = chat.messages.loaderFor(messages[0]);
              const text = confirmations.map(c => c.textContent).join();

              assert.notOk(loader, 'loader is no longer present');
              assert.ok(text.includes('could not be delivered'));
            });
          });


        });
      });

      module('a message is sent to the person', function(hooks) {
        setupRelayConnectionMocks(hooks, {
          send() {
            // should something be asserted here?
          }
        }, [
          { in: 'service:messages/dispatcher', as: 'relayConnection' }
        ]);

        hooks.beforeEach(async function() {
          await visit(`/chat/privately-with/${id}`);
          await chat.textarea.fillIn('a message');
          await chat.submitButton.click();
        });

        skip('the message is sent', function(assert) {

        });

        skip('there are 1 message in the history window', function(assert) {
          const result = chat.messages.all().length;

          assert.equal(result, 1);
        });
      });

      skip('a message can be received', function(assert) {
        assert.expect(0);
      });
    });

  });
});
