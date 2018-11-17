import Component, { tracked } from 'sparkles-component';

import { convertObjectToQRCodeDataURL } from 'emberclear/src/utils/string-encoding';
import { disableInFastboot, monitor } from 'emberclear/src/utils/decorators';

interface IArgs {
  data: object;
  alt?: string;
}

export default class QRCode extends Component<IArgs> {
  @tracked
  @disableInFastboot({ default: {} })
  @monitor
  get qrCode() {
    const { data } = this.args;

    return convertObjectToQRCodeDataURL(data);
  }
}
