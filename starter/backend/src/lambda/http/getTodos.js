import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId, getAllEntriesByUidId } from '../utils.js'

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

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
    
    const userId = getUserId(event)

    
    const scanCommand = {
      TableName: todoTable,
      FilterExpression : "userId = :userId",
      ExpressionAttributeValues: {':userId':userId}
    }

    const result = await dynamoDbClient.scan(scanCommand)
    const items = result.Items
    console.info("DKTEST CHECKING EMPTY OUTPUT ===> " + JSON.stringify(items))
    //const items = await getAllEntriesByUidId(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
