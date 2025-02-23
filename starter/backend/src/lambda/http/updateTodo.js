import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { todoExists } from '../utils.js'

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
    
    const todoId = event.pathParameters.todoId
    const validTodoId = await todoExists(todoId)
    if (!validTodoId) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Group does not exist'
        })
      }
    }
    const updateJson = JSON.parse(event.body);
    console.log('DKTEST=========================================DKTEST')
    console.log('DKTEST===== BEFORE CREATING UPDATE ENTRY  =====DKTEST')
    console.log('DKTEST=========================================DKTEST')
    console.log(JSON.stringify(event.body))
    console.log('DKTEST=========================================DKTEST')
    console.log('DKTEST todoId ===> ' + todoId)
    console.log('DKTEST doneStatus ===> ' + updateJson.done.toString())
    console.log('DKTEST tableName ===> ' + todoTable)
   
    const paramsForUpdate = {
      TableName: todoTable,
      Key:{"todoId": todoId},
      UpdateExpression: "set done = :doneStatus",            
      ExpressionAttributeValues: {':doneStatus':updateJson.done},
      ReturnValues:"UPDATED_NEW"
    }
    
    console.log('DKTEST=========================================DKTEST')
    

    const resultUpdate = await dynamoDbClient.update(paramsForUpdate)

    console.log('DKTEST=========================================DKTEST')
    console.log('DKTEST=====  AFTER CREATING UPDATE ENTRY  =====DKTEST')
    console.log('DKTEST=========================================DKTEST')

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }

  })
