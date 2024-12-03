import { isDefined } from '@toddledev/core/dist/utils/util'

const REGEXP_QUOTE = /"/g
const REGEXP_LT = /</g
const REGEXP_GT = />/g

const validAttrTypes = ['string', 'number', 'boolean']

export const escapeAttrValue = (value: any) => {
  if (!isDefined(value) || !validAttrTypes.includes(typeof value)) {
    return ''
  }
  return escapeHtml(escapeQuote(String(value)))
}

const escapeQuote = (value: string) => {
  return value.replace(REGEXP_QUOTE, '&quot;')
}

const escapeHtml = (html: string) => {
  return html.replace(REGEXP_LT, '&lt;').replace(REGEXP_GT, '&gt;')
}
