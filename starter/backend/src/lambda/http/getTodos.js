import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId} from '../utils.js'
import {getAllEntriesByUidIdNewTry} from '../../dataLayer/dynamoUtils.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    
    const userId = getUserId(event)
    
    const tmpReturn = await getAllEntriesByUidIdNewTry(userId)
    
    return tmpReturn
    
  })
