function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1, str.length)
}

function singularize (str) {
  if (/ies$/.test(str)) {
    return `${str.split('ies')[0]}y`
  } else if (/[aeiou]s$/.test(str)) {
    return `${str.slice(0, str.length - 2)}se`
  } else if (/s$/.test(str)) {
    return str.slice(0, str.length - 1)
  } else {
    return str
  }
}

function pluralize (str) {
  if (/[^aeiou]y$/.test(str)) {
    return `${str.slice(0, str.length - 1)}ies`
  } else if (/[ou]$/.test(str)) {
    return `${str}es`
  } else {
    return `${str.replace(/s$/, '')}s`
  }
}

export default {
  pluralize,
  singularize,
  capitalize
}
