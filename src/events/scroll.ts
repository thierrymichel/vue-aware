import debounce from 'lodash.debounce';
import _Vue from 'vue';
import { IOption } from '../directives/aware';
import { Manager } from './manager';

type scrollCallback = (x: number, y: number, context: _Vue) => void;

interface IScrollOption extends IOption<scrollCallback> {
  debounce?: number;
  throttle?: number;
}

export class Scroll extends Manager<IScrollOption> {
  constructor(eventName: string) {
    super(eventName);
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
    this.optionsByElement.forEach(o => {
      o.callback(window.pageXOffset, window.pageYOffset, o.context);
    });
  }
}
