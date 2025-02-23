import { parseUserId } from '../auth/utils.js'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

const todoTable = process.env.TODO_TABLE

export function getUserId(event) {
  console.info('getUserId()')
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}


export async function todoExists(todoId) {

  const scanCommand = {
    TableName: todoTable,
    FilterExpression : "todoId = :todoId",
    ExpressionAttributeValues: {':todoId':todoId}
  }

  const result = await dynamoDbClient.scan(scanCommand)
  //const items = result.Items
  
  console.log('Get todo: ', result)
  return !!result.Items
}

export async function getEntryByTodoId(todoId) {

  const scanCommand = {
    TableName: todoTable,
    FilterExpression : "todoId = :todoId",
    ExpressionAttributeValues: {':todoId':todoId}
  }

  const result = await dynamoDbClient.scan(scanCommand)
  //const items = result.Items
  
  console.log('Get todo: ', result)
  return result.Items[0]
}