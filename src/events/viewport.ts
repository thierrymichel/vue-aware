import debounce from 'lodash.debounce';
import { Manager } from './manager';

interface IViewportOption {
  debounce?: number;
  throttle?: number;
}

export class Viewport extends Manager {
  // Default throttling (ms)
  private throttle = 150;

  constructor() {
    super();
    this.handler = this.handler.bind(this);
  }

  public bind(el: HTMLElement, options: IViewportOption) {
    const throttle = options.throttle || this.throttle;

    this.handler = debounce(this.handler, throttle, {
      leading: true,
      maxWait: throttle,
      trailing: true,
    });

    if (options.debounce) {
      this.handler = debounce(this.handler, options.debounce);
    }
    window.addEventListener('resize', this.handler);
  }

  public unbind() {
    window.removeEventListener('resize', this.handler);
  }

  private handler() {
    this.callbacksByElement.forEach(cb => {
      const { innerWidth: w, innerHeight: h } = window;

      cb(w, h, w / h);
    });
  }
}
