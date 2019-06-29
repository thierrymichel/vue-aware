import { add, del, multimap } from './multimap-utils';

export default class Multimap<T> {
  private valuesByKey: multimap<T>;

  constructor() {
    this.valuesByKey = new Map();
  }

  get values(): any[] {
    const sets = Array.from(this.valuesByKey.values());

    return sets.reduce((values, set) => values.concat(Array.from(set)), []);
  }

  get size(): number {
    const sets = Array.from(this.valuesByKey.values());

    return sets.reduce((size, set) => size + set.size, 0);
  }

  public add(key: any, value: any): void {
    add(this.valuesByKey, key, value);
  }

  public delete(key: any, value: any): void {
    del(this.valuesByKey, key, value);
  }

  public has(key: any, value: any): boolean {
    const values = this.valuesByKey.get(key);

    return values && values.has(value);
  }

  public hasKey(key: any): boolean {
    return this.valuesByKey.has(key);
  }

  public hasValue(value: any): boolean {
    const sets = Array.from(this.valuesByKey.values());

    return sets.some(set => set.has(value));
  }

  public getValuesForKey(key: any): any[] {
    const values = this.valuesByKey.get(key);

    return values ? Array.from(values) : [];
  }

  public getKeysForValue(value: any): any[] {
    return Array.from(this.valuesByKey)
      .filter(([, values]) => values.has(value))
      .map(([key]) => key);
  }
}
