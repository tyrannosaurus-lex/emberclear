import Component, { tracked } from 'sparkles-component';

import { useQRScanner } from './use-qr-scanner';

interface IArgs {
  onScan: (qrContent: string) => void;
  onError: (error: Error) => void;
}

export default class QRScanner extends Component<IArgs> {
  @tracked started = false;

  constructor(args: IArgs) {
    super(args);

    // how to handle camera not found / permission denied?
    // more functions passed to useQRScanner?
    useQRScanner(this, {
      selector: '#qr-preview',
      onScan: this.args.onScan,
      onActive: () => (this.started = true),
    });
  }
}
