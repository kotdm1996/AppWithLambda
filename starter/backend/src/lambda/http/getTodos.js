import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todoTable = process.env.TODO_TABLE

//need to check how to filter todos only for specific user
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const scanCommand = {
      TableName: todoTable
    }
    const result = await dynamoDbClient.scan(scanCommand)
    const items = result.Items

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
