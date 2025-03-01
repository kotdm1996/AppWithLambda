import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrlTodo} from '../../businessLogic/generateUploadUrl_todo.js'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const returnObject = await generateUploadUrlTodo(event)
    
    return returnObject
})