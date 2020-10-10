function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1, str.length)
}

function singularize (str) {
  if (/ies$/.test(str)) {
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
  if (/[^aeiou]y$/.test(str)) {
    return `${str.slice(0, str.length - 1)}ies`
  } else if (/[ou]s$/.test(str)) {
    return `${str}ses`
  } else {
    return `${str.replace(/s$/, '')}s`
  }
}

export default {
  pluralize,
  singularize,
  capitalize
}
