export default function (props, key, attrs) {
  if (props instanceof Array) {
    if (props.indexOf('id') === -1) {
      props.push(key)
    }
  } else {
    if (!props.id) {
      props[key] = attrs || { type: String, default: null }
    }
  }
}
