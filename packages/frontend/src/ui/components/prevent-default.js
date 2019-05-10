import { helper as buildHelper } from '@ember/component/helper';

export function preventDefault([fn] /*, hash*/) {
  return (...args) => {
    const firstArg = args[0];

    if (firstArg && firstArg.preventDefault) {
      firstArg.preventDefault();
    }

    return fn(...args);
  };
}

export const helper = buildHelper(preventDefault);
