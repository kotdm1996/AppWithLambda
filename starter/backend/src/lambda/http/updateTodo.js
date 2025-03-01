import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {update_todo_event} from '../../businessLogic/update_todo_event.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    
    const returnResult = await update_todo_event(event)
    return returnResult
  })
