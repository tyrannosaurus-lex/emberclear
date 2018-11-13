import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | messages/handler', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('service:messages/handler');
    assert.ok(route);
  });

  module('handle', function() {
    module('a chat message', function() {

    });

    module('an emote message', function() {

    });

    module('a delivery confirmation', function() {

    });

    module('a disconnect message', function() {

    });

    module('a ping', function() {

    });

    module('an unknown type of message', function() {

    });
  });
});
