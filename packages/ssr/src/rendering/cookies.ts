import { isDefined } from '@toddledev/core/dist/utils/util'
import cookie from 'cookie'

export const getRequestCookies = (req: Request) =>
  Object.fromEntries(
    Object.entries(cookie.parse(req.headers.get('cookie') ?? '') ?? {}).filter(
      // Ensure that both key and value are defined
      (kv): kv is [string, string] => isDefined(kv[0]) && isDefined(kv[1]),
    ),
  )
