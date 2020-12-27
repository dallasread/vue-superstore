import uniqId from 'uniq-id'

const uuid = uniqId.generateUUID('xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxy', 64)

function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1, str.length)
}

function singularize (str) {
  if (str === 'people' || str === 'person') {
    return 'person'
  } else if (/ies$/.test(str)) {
    return `${str.split('ies')[0]}y`
  } else if (/sses$/.test(str)) {
    return `${str.slice(0, str.length - 3)}`
  } else if (/[aeiou][aeiou]s$/.test(str)) {
    return `${str.slice(0, str.length - 1)}`
  } else if (/es$/.test(str)) {
    return `${str.slice(0, str.length - 1)}`
  } else if (/s$/.test(str)) {
    return str.slice(0, str.length - 1)
  } else {
    return str
  }
}

function pluralize (str) {
  if (str === 'person' || str === 'people') {
    return 'people'
  } else if (/[^aeiou]y$/.test(str)) {
    return `${str.slice(0, str.length - 1)}ies`
  } else if (/[ou]s$/.test(str)) {
    return `${str}ses`
  } else {
    return `${str.replace(/s$/, '')}s`
  }
}

function arrToObj (props) {
  if (props instanceof Array) {
    const obj = {}

    for (var i = 0; i < props.length; i++) {
      obj[props[i]] = {}
    }

    return obj
  } else {
    return props
  }
}

export default {
  arrToObj,
  capitalize,
  uuid,
  pluralize,
  singularize
}
