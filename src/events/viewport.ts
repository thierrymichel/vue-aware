import debounce from 'lodash.debounce';
import _Vue from 'vue';
import { IOption } from '../directives/aware';
import { Manager } from './manager';

type viewportCallback = (
  width: number,
  height: number,
  ratio: number,
  context: _Vue
) => void;

interface IViewportOption extends IOption<viewportCallback> {
  debounce?: number;
  throttle?: number;
}

export class Viewport extends Manager<IViewportOption> {
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
    this.optionsByElement.forEach(o => {
      const { innerWidth: w, innerHeight: h } = window;

      o.callback(w, h, w / h, o.context);
    });
  }
}
