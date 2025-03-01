import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { delete_todo_event } from '../../businessLogic/delete_todo_event.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log("deleteTodo() event received ==> " + event)
    const deleteStatus = await delete_todo_event(event)    
    return deleteStatus
  })