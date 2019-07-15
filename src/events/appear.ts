import _Vue from 'vue';
import { IOption } from '../directives/aware';
import Multimap from '../utils/multimap';
import { Manager } from './manager';

type appearCallback = (
  isInViewport: boolean,
  isFullyInViewport: boolean,
  position: string,
  context: _Vue
) => void;

interface IAppearOption extends IOption<appearCallback> {
  once?: boolean;
  root?: Element;
  rootMargin?: string; // DOMString ?
  threshold?: number | number[];
}

export class Appear extends Manager<IAppearOption> {
  private observers: Set<IntersectionObserver>;
  private elementsByObserver: Multimap<HTMLElement>;
  private onceByElement: Map<HTMLElement, boolean>;

  constructor(eventName: string) {
    super(eventName);
    if (typeof (window as any).IntersectionObserver === 'undefined') {
      /* tslint:disable:max-line-length */
      console.warn(
        '[vue-aware] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill'
      );
      /* tslint:enable:max-line-length */

      return;
    }

    this.observers = new Set();
    this.elementsByObserver = new Multimap();
    this.onceByElement = new Map();
  }

  public bind(el: HTMLElement, opts: IAppearOption) {
    const options: IAppearOption = {
      once: false,
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 1],
      ...opts,
    };

    const observer = this.createObserver(options, el);

    this.onceByElement.set(el, options.once);
    this.optionsByElement.set(el, options);
    observer.observe(el);
  }

  public unbind(el: HTMLElement) {
    this.unobserve(el);
  }

  private createObserver(
    options: IAppearOption,
    el: HTMLElement
  ): IntersectionObserver {
    const existingObserver = this.getObserverByOptions(options);

    if (existingObserver) {
      if (!this.getObserverByElement(el)) {
        this.addObserver(existingObserver, el);
      }

      return existingObserver;
    }

    const newObserver = new IntersectionObserver(
      this.intersected.bind(this),
      options
    );

    this.addObserver(newObserver, el);

    return newObserver;
  }

  private getObserverByOptions(options: IAppearOption): IntersectionObserver {
    const thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold];

    return Array.from(this.observers).find(
      observer =>
        observer.root === options.root &&
        observer.rootMargin === options.rootMargin &&
        JSON.stringify(observer.thresholds) === JSON.stringify(thresholds)
    );
  }

  private getObserverByElement(el: HTMLElement): IntersectionObserver {
    return this.elementsByObserver.getKeysForValue(el)[0];
  }

  private addObserver(observer: IntersectionObserver, el: HTMLElement) {
    this.observers.add(observer);
    this.elementsByObserver.add(observer, el);
  }

  private removeObserver(observer: IntersectionObserver, el: HTMLElement) {
    this.elementsByObserver.delete(observer, el);

    if (this.elementsByObserver.getValuesForKey(observer).length === 0) {
      this.observers.delete(observer);
    }
  }

  private unobserve(el: HTMLElement) {
    const existingObserver = this.getObserverByElement(el);

    existingObserver && existingObserver.unobserve(el);
    this.removeObserver(existingObserver, el);
  }

  private intersected(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      let isInViewport = false;
      let isFullyInViewport = false;

      if (entry.isIntersecting) {
        isInViewport = true;
        if (entry.intersectionRatio >= 1) {
          isFullyInViewport = true;
        } else {
          isFullyInViewport = false;
        }
      } else {
        isInViewport = false;
        isFullyInViewport = false;
      }

      const isBeforeViewport =
        entry.boundingClientRect.top < entry.rootBounds.top;
      const isAfterViewport =
        entry.boundingClientRect.top + entry.boundingClientRect.height >
        entry.rootBounds.top + entry.rootBounds.height;
      let position = 'center';

      if (isBeforeViewport) {
        position = 'top';
      } else if (isAfterViewport) {
        position = 'bottom';
      }

      const o = this.optionsByElement.get(el);

      o.callback(isInViewport, isFullyInViewport, position, o.context);

      if (isInViewport && this.onceByElement.get(el)) {
        this.unobserve(el);
      }
    });
  }
}
