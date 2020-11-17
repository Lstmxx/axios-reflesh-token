function isObject (obj) {
  return typeof obj === 'object'
}

function forEach (obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }
  if (typeof obj !== 'object') {
    obj = [obj]
  }
  if (Array.isArray(obj)) {
    for (let index = 0; index < obj.length; index++) {
      fn(obj[index], index, obj)
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn(obj[key], key, obj)
      }
    }
  }
}

export function isFunction (_function) {
  return typeof _function === 'function'
}

export function merge () {
  const result = {}
  function assignValue (val, key) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = merge(result[key], val)
    } else {
      result[key] = val
    }
  }
  for (let index = 0, l = arguments.length; index < l; index++) {
    forEach(arguments[index], assignValue)
  }
  return result
}
