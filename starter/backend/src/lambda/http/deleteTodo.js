import { DeleteItemCommand, DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.js'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todoTable = process.env.TODO_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    
    const todoId = event.pathParameters.todoId
    //const bearerToken = event.headers.Authorization
    //const userId = getUserId(event)

    const deleteParams = {
      TableName: todoTable,
      Key: {
        todoId: todoId
      }
    }
    //const deleteItemCommand = new DeleteItemCommand(deleteParams)
    const result = await dynamoDbClient.delete(deleteParams)
    const items = result.Items
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

  /***
   * 
   *export async function handler(event) {
  console.log('Processing event: ', event)
  const todoId = event.pathParameters.todoId

  const deleteTodoEvent = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)
  
  const deleteItem = {
    id: todoId,
    userId,    
  }
  //...newTodo

  await dynamoDbClient.deleteItem({
    TableName: todoTable,
    Item: deleteItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      deleteItem
    })
  }
}
   *  
   */
