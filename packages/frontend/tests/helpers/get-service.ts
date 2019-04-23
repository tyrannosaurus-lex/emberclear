import { getContext } from '@ember/test-helpers';
import ApplicationInstance from '@ember/application/instance';

interface Context {
  owner: ApplicationInstance;
}

export function getService<T>(name: string): T {
  const { owner } = getContext() as Context;

  const service = owner.lookup(`service:${name}`);

  return service;
}
