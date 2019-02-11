import Component, { tracked } from 'sparkles-component';

import { useQRScanner } from './use-qr-scanner';

interface IArgs {
  onScan: (qrContent: string) => void;
  onError: (error: Error) => void;
}

export default class QRScanner extends Component<IArgs> {
  @tracked started = false;
  @tracked cameraNotFound = false;

  constructor(args: IArgs) {
    super(args);

    useQRScanner(this, {
      selector: '#qr-preview',
      onScan: this.args.onScan,
      onActive: () => (this.started = true),
      onError: (e: Error | string) => {
        if (typeof e === 'string' && e.includes('Camera not found')) {
          this.cameraNotFound = true;
        }
      },
    });
  }
}
