import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {create_new_todo} from '../../businessLogic/create_new_todo.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {

    const result = await create_new_todo(event)
    return result
  })

