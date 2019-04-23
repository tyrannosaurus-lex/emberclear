import ApplicationInstance from '@ember/application/instance';
// the dompurify type package is named wrong
import DOMPurify from 'dompurify';

declare module '@ember/test-helpers' {
  interface AppContext {
    element: HTMLElement;
    owner: ApplicationInstance;
  }

  export function getContext(): AppContext;
}

declare module 'dom-purify' {
  export default DOMPurify;
}
