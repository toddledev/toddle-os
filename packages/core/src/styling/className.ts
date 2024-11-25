// cSpell: ignore phash
const SEED = 5381

// When we have separate strings it's useful to run a progressive
// version of djb2 where we pretend that we're still looping over
// the same string
const phash = (h: number, x: string) => {
  let i = x.length

  while (i) {
    h = (h * 33) ^ x.charCodeAt(--i)
  }

  return h
}

// This is a djb2 hashing function
const hash = (x: string) => {
  return phash(SEED, x)
}

const AD_REPLACER_R = /(a)(d)/gi

/* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalized
 * counterparts */
const charsLength = 52

/* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalized letters */
const getAlphabeticChar = (code: number) =>
  String.fromCharCode(code + (code > 25 ? 39 : 97))

/* input a number, usually a hash and convert it to base-52 */
function generateAlphabeticName(code: number) {
  let name = ''
  let x

  /* get a char and divide by alphabet-length */
  for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
    name = getAlphabeticChar(x % charsLength) + name
  }

  return (getAlphabeticChar(x % charsLength) + name).replace(
    AD_REPLACER_R,
    '$1-$2',
  )
}

export const getClassName = (object: any) => {
  return generateAlphabeticName(hash(JSON.stringify(object)))
}

export const toValidClassName = (
  input: string,
  escapeSpecialCharacters = false,
) => {
  // Replace invalid characters with hyphens
  let className = input
    // Remove leading and trailing whitespace
    .trim()
    // Replace whitespace with hyphens
    .replace(/\s+/g, '-')

  if (escapeSpecialCharacters) {
    className = className.replace(/[^a-zA-Z0-9-_]/g, (match) => `\\${match}`)
  }

  // Ensure the class name doesn't start with a number or special character
  if (/^[^a-zA-Z]/.test(className)) {
    className = `_${className}`
  }

  return className
}
