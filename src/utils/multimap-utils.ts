export type multimap<T> = Map<any, Set<T>>;

/**
 * Add key, value to multimap
 */
export function add(map: multimap<any>, key: any, value: any): void {
  fetch(map, key).add(value);
}

/**
 * Delete key, value to multimap
 */
export function del(map: multimap<any>, key: any, value: any): void {
  fetch(map, key).delete(value);
  prune(map, key);
}

/**
 * Fetch multimap value
 */
export function fetch(map: multimap<any>, key: any): Set<any> {
  let values = map.get(key);

  if (!values) {
    values = new Set();
    map.set(key, values);
  }

  return values;
}

/**
 * Clean multimap key
 */
export function prune(map: multimap<any>, key: any): void {
  const values = map.get(key);

  if (values !== null && values.size === 0) {
    map.delete(key);
  }
}
