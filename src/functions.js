export function titleCase(str) {
    return str[0].toUpperCase() + str.slice(1);
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }