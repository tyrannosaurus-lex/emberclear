interface IArgs {
  willDestroy: () => void;
  didInsert: () => void;
}

export function useEffect(context: any, { willDestroy, didInsert }: IArgs) {
  let { destroy, didInsertElement } = context;

  async function handleDestroy() {
    if (willDestroy) {
      await willDestroy();
    }

    if (destroy) {
      await destroy();
    }
  }

  async function handleInsert() {
    if (didInsert) {
      await didInsert();
    }

    if (didInsertElement) {
      await didInsertElement();
    }
  }

  context.didInsertElement = handleInsert;
  context.destroy = handleDestroy;
}
