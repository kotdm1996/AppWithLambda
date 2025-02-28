import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { deleteTodoByTodoId, getUserId, getAllFilesEntriesByTodoIdNewTry, deleteFileIdByTodoIds} from '../utils.js'

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
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    console.log("Trying to delete todoId ==> " + todoId + " UID ==> " + userId)
    const items = await deleteTodoByTodoId(todoId, userId)
    
    console.log("DKTEST ====  DELETE TODO ============== DKTEST")
    console.log(JSON.stringify({items}))
    console.log("DKTEST ====  DELETE TODO ============== DKTEST")    

    console.log("DKTEST ====  DELETE TODO from files ============== DKTEST")
    
    const fileTableItems = await getAllFilesEntriesByTodoIdNewTry(todoId)
    console.log(fileTableItems.body)
    console.log(typeof(fileTableItems.body))
    const fileRecordstToDelete = JSON.parse(fileTableItems.body)
    for (const tmpItem of fileRecordstToDelete.items) {
      console.log(`fileId: ${tmpItem.fileId}, todoId: ${tmpItem.todoId}`);
      const tmpDeleteResult = await deleteFileIdByTodoIds(tmpItem.todoId, tmpItem.fileId)
      console.log(tmpDeleteResult)
    }
    console.log("DKTEST ====  END OF DELETE TODO ============== DKTEST")    

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })