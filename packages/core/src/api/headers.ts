/**
 * Checks if a header is a json (content-type) header
 * Also supports edge cases like application/vnd.api+json and application/vnd.contentful.delivery.v1+json
 * See https://jsonapi.org/#mime-types
 */
export const isJsonHeader = (header?: string | null) => {
  if (typeof header !== 'string') {
    return false
  }
  return /^application\/(json|.*\+json)/.test(header)
}

export const isTextHeader = (header?: string | null) => {
  if (typeof header !== 'string') {
    return false
  }
  return /^(text\/|application\/x-www-form-urlencoded|application\/(xml|.*\+xml))/.test(
    header,
  )
}

export const isEventStreamHeader = (header?: string | null) => {
  if (typeof header !== 'string') {
    return false
  }
  return /^text\/event-stream/.test(header)
}

export const isJsonStreamHeader = (header?: string | null) => {
  if (typeof header !== 'string') {
    return false
  }
  return /^(application\/stream\+json|application\/x-ndjson)/.test(header)
}

export const isImageHeader = (header?: string | null) => {
  if (typeof header !== 'string') {
    return false
  }
  return /^image\//.test(header)
}
