import debounce from 'lodash.debounce';
import { Manager } from './manager';

interface IScrollOption {
  debounce?: number;
  throttle?: number;
}

export class Scroll extends Manager {
  constructor() {
    super();
    this.handler = this.handler.bind(this);
  }

  public bind(el: HTMLElement, options: IScrollOption) {
    if (options.throttle) {
      this.handler = debounce(this.handler, options.throttle, {
        leading: true,
        maxWait: options.throttle,
        trailing: true,
      });
    }
    if (options.debounce) {
      this.handler = debounce(this.handler, options.debounce);
    }
    window.addEventListener('scroll', this.handler);
  }

  public unbind() {
    window.removeEventListener('scroll', this.handler);
  }

  private handler() {
    this.callbacksByElement.forEach(cb => {
      cb(window.pageXOffset, window.pageYOffset);
    });
  }
}
