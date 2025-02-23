import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')

//const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

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
    logger.info(event)
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