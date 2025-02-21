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

async function createFile(todoId, fileId, event) {
  const timestamp = new Date().toISOString()
  const newFile = JSON.parse(event.body)

  const newItem = {
    todoID,
    timestamp,
    fileId,
    fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileId}`,
    ...newFile
  }
  console.log('Storing new item: ', newItem)

  await dynamoDbClient.put({
    TableName: fileTable,
    Item: newItem,
  })

  return newItem
}

async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}