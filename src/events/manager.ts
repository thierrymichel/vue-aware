export abstract class Manager<O> {
  public optionsByElement: Map<HTMLElement, O>;

  constructor() {
    this.optionsByElement = new Map();
  }

  public abstract bind(el: HTMLElement, options: O): void;
  public abstract unbind(el: HTMLElement): void;

  public add(el: HTMLElement, options: any) {
    this.optionsByElement.set(el, options);

    if (this.optionsByElement.size === 1) {
      this.bind(el, options);
    }
  }

  public remove(el: HTMLElement) {
    this.optionsByElement.delete(el);

    if (this.optionsByElement.size === 0) {
      this.unbind(el);
    }
  }
}
