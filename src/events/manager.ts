export abstract class Manager {
  public callbacksByElement: Map<HTMLElement, any>;

  constructor() {
    this.callbacksByElement = new Map();
  }

  public abstract bind(el: HTMLElement, options: any): void;
  public abstract unbind(el: HTMLElement): void;

  public add(el: HTMLElement, options: any) {
    this.callbacksByElement.set(el, options.callback);

    if (this.callbacksByElement.size === 1) {
      this.bind(el, options);
    }
  }

  public remove(el: HTMLElement) {
    this.callbacksByElement.delete(el);

    if (this.callbacksByElement.size === 0) {
      this.unbind(el);
    }
  }
}
