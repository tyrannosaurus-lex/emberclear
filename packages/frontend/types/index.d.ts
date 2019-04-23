import ApplicationInstance from '@ember/application/instance';
// the dompurify type package is named wrong
import DOMPurify from 'dompurify';

declare module '@ember/test-helpers' {
  interface AppContext {
    element: HTMLElement;
    owner: {
      application: ApplicationInstance;
      register: (name: string, obj: any) => void;
      lookup: <T = any>(name: string) => T;
    };
  }

  export function getContext(): AppContext;
}

declare module 'dom-purify' {
  export default DOMPurify;
}

declare module '@ember/service' {
  interface Registry {
    ['notification-messages']: {
      clear(): void;
      clearAll(): void;
    };
  }
}
