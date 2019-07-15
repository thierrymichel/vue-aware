import _Vue, { DirectiveFunction, VNode } from 'vue';
import { Appear, Raf, Scroll, Viewport } from '../events';
import isEqual from '../utils/is-equal';
import Multimap from '../utils/multimap';

export interface IOption<T extends (...args: any[]) => void> {
  // Not allowed with TS
  // callback: (...args: Parameters<T>, context: _Vue) => void;
  callback: (...args: Parameters<T>) => void;
  context: _Vue;
}

class AwareCore {
  public eventNames: string[];
  public elementsByEventName: Multimap<HTMLElement>;
  private managerByEventName: Map<string, any>;

  constructor() {
    this.eventNames = [];
    this.elementsByEventName = new Multimap();
    this.managerByEventName = new Map();
  }

  // TODO: improve type `Manager: any`
  /**
   * Register event with his manager.
   */
  // tslint:disable-next-line:variable-name
  public register(eventName: string, Manager: any) {
    const manager = new Manager(eventName);

    if (manager) {
      this.eventNames.push(eventName);
      this.managerByEventName.set(eventName, manager);
    }
  }

  /**
   * Add event listener to element.
   */
  // TODO: improve type `options: any`
  public add(eventName: string, el: HTMLElement, options: any) {
    const manager = this.managerByEventName.get(eventName);

    manager.add(el, options);
    this.elementsByEventName.add(eventName, el);
  }

  /**
   * Remove event listener from element.
   */
  public remove(eventName: string, el: HTMLElement) {
    const manager = this.managerByEventName.get(eventName);

    manager.remove(el);
    this.elementsByEventName.delete(eventName, el);
  }

  /**
   * Update event listener of element.
   */
  // TODO: improve type `options: any`
  // TODO: manage options changes…
  // tslint:disable-next-line:no-empty
  public update(eventName: string, el: HTMLElement, options: any) {}
}

const core = new AwareCore();

core.register('appear', Appear);
core.register('raf', Raf);
core.register('scroll', Scroll);
core.register('viewport', Viewport);

function getOptions(eventName: string, value: any, vnode: VNode): any {
  const { context, data } = vnode;
  const { on: handlers } = data;

  // Options based on `v-aware="{}"`
  const options: IOption<() => void> = (value && value[eventName]) || {};

  // If no callback option, check @event
  /* istanbul ignore else */
  if (!options.callback && handlers) {
    options.callback = handlers[eventName] as () => void;
  }

  // Add context (Vue instance)
  options.context = context;

  return options;
}

const inserted: DirectiveFunction = (el, { value }, vnode) => {
  const { on: handlers } = vnode.data;

  // Just the directive. No value, no @/v-on events.
  /* istanbul ignore else */
  if (!handlers && !value) {
    return;
  }

  // Register callbacks.
  core.eventNames.forEach(name => {
    const options = getOptions(name, value, vnode);

    /* istanbul ignore else */
    if (options.callback) {
      core.add(name, el, options);
    }
  });
};

const unbind: DirectiveFunction = (el, binding, vnode) => {
  // Unregister callbacks.
  core.eventNames.forEach(name => {
    /* istanbul ignore else */
    if (core.elementsByEventName.has(name, el)) {
      core.remove(name, el);
    }
  });
};

const update: DirectiveFunction = (el, { value, oldValue }, vnode) => {
  core.eventNames.forEach(name => {
    const options = getOptions(name, value, vnode);

    // Check if element is registered for the event.
    if (core.elementsByEventName.has(name, el)) {
      // If callback still here
      if (options.callback) {
        // And options changed
        /* istanbul ignore else */
        if (!isEqual(value, oldValue)) {
          core.update(name, el, options);
        }
      } else {
        // No more callback, remove it.
        core.remove(name, el);
      }
    } else {
      // Element was not registered, new callback added.
      /* istanbul ignore else */
      if (options.callback) {
        core.add(name, el, options);
      }
    }
  });
};

export default {
  core,
  inserted,
  unbind,
  update,
};
