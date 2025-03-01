import { getUserId } from '../lambda/utils.js'
import { createLogger } from '../utils/logger.mjs'
import {deleteTodoByTodoId, getAllFilesEntriesByTodoIdNewTry, deleteFileIdByTodoIds} from '../dataLayer/dynamoUtils.js'
import { deleteS3Entry } from '../dataLayer/s3Utils.js'

const logger = createLogger('deleteTodoEvent')

export async function delete_todo_event(event) {

    console.log('Processing event: ', event)
    logger.info(event)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    console.log("Trying to delete todoId ==> " + todoId + " UID ==> " + userId)
    //deleting from todoTable
    const items = await deleteTodoByTodoId(todoId, userId)
    
    
    console.log(JSON.stringify({items}))
    
    //now need to clean files table, deleting all entries related to todoId
    const fileTableItems = await getAllFilesEntriesByTodoIdNewTry(todoId)
    console.log(fileTableItems.body)
    console.log(typeof(fileTableItems.body))
    const fileRecordstToDelete = JSON.parse(fileTableItems.body)
    for (const tmpItem of fileRecordstToDelete.items) {
      console.log(`fileId: ${tmpItem.fileId}, todoId: ${tmpItem.todoId}, fileUrl: ${tmpItem.fileUrl}`);
      const tmpDeleteResult = await deleteFileIdByTodoIds(tmpItem.todoId, tmpItem.fileId)      
      console.log(tmpDeleteResult)
      await deleteS3Entry(tmpItem.fileUrl)
    }
    console.log("DKTEST ====  END OF DELETE TODO ============== DKTEST")    

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  }