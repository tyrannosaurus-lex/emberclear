import QrScanner from 'qr-scanner';

import { useEffect } from 'emberclear/src/utils/use-effect';

interface IArgs {
  selector: string;
  onScan: (qrContent: string) => void;
  onActive: () => void;
  onError: (e: Error | string) => void;
}

export function useQRScanner(context: any, { selector, onScan, onActive, onError }: IArgs) {
  let scanner: QrScanner;

  useEffect(context, {

    willDestroy: () => {
      if (!scanner) return;

      scanner.stop();
      scanner._qrWorker && scanner._qrWorker.terminate();
    },

    didInsert: async () => {
      scanner = newScanner();

      try {
        await scanner.start();

        onActive();
      } catch (e) {
        onError(e);
      }
    },
  });

  let newScanner = (): QrScanner => {
    const video = document.querySelector(selector)!;

    const _scanner = new QrScanner(video, (result: string) => {
      _scanner.stop();
      _scanner._qrWorker.terminate();

      onScan(result);
    });

    return _scanner;
  };
}

