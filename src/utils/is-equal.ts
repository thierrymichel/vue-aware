export default function isEqual(val1: any, val2: any) {
  if (val1 === val2) {
    return true;
  }
  if (typeof val1 === 'object') {
    for (const key in val1) {
      if (!isEqual(val1[key], val2[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
