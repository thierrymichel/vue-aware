export abstract class Manager<O> {
  public name: string;
  public optionsByElement: Map<HTMLElement, O>;

  constructor(eventName: string) {
    this.name = eventName;
    this.optionsByElement = new Map();
  }

  public abstract bind(el: HTMLElement, options: O): void;
  public abstract unbind(el: HTMLElement): void;

  public add(el: HTMLElement, options: any) {
    this.optionsByElement.set(el, options);
    this.bind(el, options);
  }

  public remove(el: HTMLElement) {
    this.optionsByElement.delete(el);
    this.unbind(el);
  }
}
