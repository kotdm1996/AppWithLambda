import { v4 as uuidv4 } from 'uuid'
import { getUploadUrl, generateFileUrl } from '../dataLayer/s3Utils.js'
import { todoExists, getEntryByTodoId,insertIntoFileDb } from '../dataLayer/dynamoUtils.js'

export async function generateUploadUrlTodo(event) {
    console.log('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const validTodoId = await todoExists(todoId)

    if (!validTodoId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({error: 'Todo does not exist'})
      }
    }
    const newFile = JSON.parse(event.body)
    const fileId = uuidv4()
    const todoItem = await getEntryByTodoId(todoId)
    todoItem.fileUrl = await generateFileUrl(fileId)
    const fileUploadUrl = await getUploadUrl(fileId)
    const timestamp = new Date().toISOString()

    const newItem = {
      todoId,
      timestamp,
      fileId,
      fileUrl: todoItem.fileUrl,
      ...newFile
    }

    console.log('Storing new item record in files table: ', newItem)
    await insertIntoFileDb(newItem)
    
    console.log('File Upload URL ==> ' + fileUploadUrl)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        newItem: todoItem,
        uploadUrl: fileUploadUrl
      })
    }
}
