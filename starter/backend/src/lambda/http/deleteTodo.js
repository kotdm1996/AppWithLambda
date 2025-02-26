import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { deleteTodoByTodoId } from '../utils.js'

const logger = createLogger('deleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    logger.info(event)
    const todoId = event.pathParameters.todoId
    
    const items = await deleteTodoByTodoId(todoId)
    
    console.log("DKTEST ====  DELETE TODO ============== DKTEST")
    console.log(JSON.stringify({items}))
    console.log("DKTEST ====  DELETE TODO ============== DKTEST")    

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })