import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {todoExists, getEntryByTodoId } from '../utils.js'

const s3Client = new S3Client()
const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

const filesTable = process.env.FILES_TABLE
const bucketName = process.env.FILES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
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
        body: JSON.stringify({error: 'Todo does not exist'})
      }
    }
    const newFile = JSON.parse(event.body)
    const fileId = uuidv4()
    const todoItem = await getEntryByTodoId(todoId)
    todoItem.fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileId}`
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

    await dynamoDbClient.put({
      TableName: filesTable,
      Item: newItem,
    })

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
})

async function getUploadUrl(fileId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}