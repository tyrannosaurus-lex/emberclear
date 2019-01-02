import { PromiseMonitor } from 'ember-computed-promise-monitor';

 // https://tc39.github.io/proposal-decorators/#sec-elementdescriptor-specification-type
 interface ElementDescriptor {
  descriptor: PropertyDescriptor;
  initializer?: () => any; // unknown
  key: string;
  kind: 'method' | 'field' | 'initializer';
  placement: 'own' | 'prototype' | 'static';
  finisher?: (klass: any) => any
}

interface MethodDecorator {
  descriptor: PropertyDescriptor;
  key: string;
  kind: 'method' | 'field' | 'initializer';
  placement: 'own' | 'prototype' | 'static';
}

export function syncToLocalStorage<T>(desc: MethodDecorator): ElementDescriptor {
  const result: ElementDescriptor = {
    ...desc,
    kind: 'method',
    descriptor: {
      enumerable: false,
      configurable: false,
    },
  };

  result.finisher = (klass: Object) => {
    const targetName = klass.constructor.name;
    const key = `${targetName}-${desc.key}`;

    result.descriptor.get = (): T => {
      const lsValue = localStorage.getItem(key);
      const json = (lsValue && JSON.parse(lsValue)) || {};

      return json.value;
    },
    result.descriptor.set = (value: any) => {
      const lsValue = JSON.stringify({ value });

      localStorage.setItem(key, lsValue);
    }
  }

  result.descriptor.get = () => {};
  result.descriptor.set = () => {};

  return result;
}

export function monitor<T = any>(
  desc: ElementDescriptor
) {
  const { descriptor } = desc;
  const { get: oldGet } = descriptor;

  return {
    ...desc,
    kind: 'method',
    descriptor: {
      ...desc.descriptor,

      get(){
        const promise = oldGet!.apply(this);

        return new PromiseMonitor<T>(promise);
      },
    },
  };
}
