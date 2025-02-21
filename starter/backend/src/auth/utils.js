import jsonwebtoken from 'jsonwebtoken'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  console.log('inside parseUserId()')
  
  console.log('parseUserId() tokenTmp --> ' + jwtToken)
  const decodedJwt = jsonwebtoken.decode(jwtToken)
  console.log('DKTEST GOT BACK')
  console.log(decodedJwt)
  console.log('DKTEST BEFORE RETURN')
  return decodedJwt.sub
}
