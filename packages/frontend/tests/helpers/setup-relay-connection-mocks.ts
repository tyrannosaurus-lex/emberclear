import { stubService } from './stub-service';

interface IMockServiceTarget {
  in: string;
  as: string;
}

export function setupRelayConnectionMocks(
  hooks: NestedHooks,
  overrides = {},
  targets: IMockServiceTarget[] = []
) {
  hooks.beforeEach(function() {
    stubService(
      'relay-manager',
      {
        getRelay() {},
        getOpenGraph() {},
        connect() {},
      },
      [{ in: 'route:application', as: 'relayManager' }, { in: 'route:chat', as: 'relayManager' }]
    );
    stubService(
      'relay-connection',
      {
        // get relay() {
        //   throw new Error('service:relay-connection not properly mocked');
        // },
        setRelay() {},
        connect() {
          return;
        },
        ...overrides,
      },
      [{ in: 'service:relay-manager', as: 'relayConnection' }, ...targets]
    );
  });
}
