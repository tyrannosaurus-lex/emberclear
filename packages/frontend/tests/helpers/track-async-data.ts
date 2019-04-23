import { getStore } from './get-store';

export function trackAsyncDataRequests(hooks: NestedHooks) {
  hooks.beforeEach(function() {
    const store = getStore();

    store.generateStackTracesForTrackedRequests = true;
    store.shouldTrackAsyncRequests = true;
  });
}
