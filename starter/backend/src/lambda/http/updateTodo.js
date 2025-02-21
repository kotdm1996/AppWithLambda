import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { v4 as uuidv4 } from 'uuid'

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)
const s3Client = new S3Client()

const todoTable = process.env.TODO_TABLE
const filesTable = process.env.FILES_TABLE
const bucketName = process.env.FILES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function handler(event) {
  console.log('Caller event', event)

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
  //here need to update valideToDoId , send update to dynamo db and return status
  //could be this
  /**
   * https://stackoverflow.com/questions/76847397/best-way-to-update-data-in-dynamodb-via-a-lambda
   * need to check
   *  Key: {
      id: `${req.user.sub}`,
    },
    UpdateExpression: `set age = ${req.body.age}, country = ${req.body.country}, skills = ${req.body.skills}`,
    ReturnValues: "ALL_NEW",
   * 
   */
  await dynamoDbClient.UpdateItem({
    TableName: todoTable,
    Item: newItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }

  /***
  const fileID = uuidv4()
  const newItem = await createFile(todoId, fileID, event)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
    *******/
}

async function todoExists(todoId) {
  const result = await dynamoDbClient.get({
    TableName: todoTable,
    Key: {
      id: todoId
    }
  })

  console.log('Get todo: ', result)
  return !!result.Item
}
