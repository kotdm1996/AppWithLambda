import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
//import { createLogger } from '../../utils/logger.mjs'

const certificate=`-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJI1mm507EhQwCMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1sYzE2MDRsNnR2OGNyZHlhLnVzLmF1dGgwLmNvbTAeFw0yNTAyMTUw
NDI3MzJaFw0zODEwMjUwNDI3MzJaMCwxKjAoBgNVBAMTIWRldi1sYzE2MDRsNnR2
OGNyZHlhLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAL4lmjD+Uokg7Cl58G4bIpxgnoInqbTG7qoDHYEqk/CPAvnl6guCyzQp3I+S
pW7S5ELIA8B00bTep93jaa9JZdeiccD6tvLu2819y45NK7I4DnGtk7kTg+w0na9Q
mbgEQ7ZuHljS1zRKelYnwQHOsVa8O9YJTA8500GLTKjlt7JhgxSyASsDqxbofdx3
Dj/rKZDfktPi8I68C74UdOB6yNLyBEb6rvu+tvWJY6oJqBXKuetrUhvMUfZuBIG7
AbwQloGfyaULC7CNWVs9jsYqJp32ZGEMKvESD9lqw15jN6W4D3v5FelH6iGJBt9i
xAneRbyL0p2pqQ9CyYUvkMdouVMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUEbylzP19V5TkosgSSPCNxLoLb+QwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBX4cm84gPuxxcDNvKwIf/zcfUUbgElMFGzau1rvS1e
vSH2xGmK68ATClXmVFw24oV/yHWWH4H6Xt8GqeqBvX8v+Uwczs0QK0ohxVHNjG3W
tL5xr4TwyjGdbvn/IeaCdVd0ZE3ahzYE+/lGdDNZ32UcAFDoMy8E/Gzc7mymEp6/
VNf2idVO7NLkGTNZAeOIRuzLdHlVwxnRqASKRfaSGyHHpkQSPo+KQFl9bG6J8Qw3
MyC28VqPlyV54/D4qVke1MTlrK/vLH4UPNtXQoykFjfooSkl8ptGNmsbNBEMz6SA
evhnN+1z7UUbV6zU9dsHW9DrDEdfB8BE889KeCgWwGzN
-----END CERTIFICATE-----`

//const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  console.debug('DKTEST ===> 1')
  console.debug('Token ==>' + token)
  console.debug('DKTEST ===> 2')
  console.debug('jwt ==>' + jwt)
  console.debug('DKTEST ===> 3')
  //DKTEST need to confirm , probably something different here  - could be because algorithm is different we need different code call
  
  // TODO: Implement token verification
  console.debug('DKTEST ===> 4 ... before jsonwebtoken.verify()')
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  //return undefined;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
