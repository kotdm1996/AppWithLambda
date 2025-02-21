import { parseUserId } from '../auth/utils.js'

export function getUserId(event) {
  console.info('getUserId()')
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
