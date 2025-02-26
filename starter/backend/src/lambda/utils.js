import { parseUserId } from '../auth/utils.js'
import { DynamoDB , QueryCommand} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

const todoTable = process.env.TODO_TABLE
const filesTable = process.env.FILES_TABLE

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

export async function getAllEntriesByUidId(userId) {

  console.log("getAllEntriesByUidId() ==> " + userId)
  const tmpCommand = {
    TableName: todoTable,    
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {':userId':userId}
  }

  console.log("getAllEntriesByUidId() ==> QueryCommand")
  console.log(JSON.stringify(tmpCommand))
  const command = new QueryCommand(tmpCommand)
  try{
    const result = await dynamoDbClient.send(command)
    console.log('Get todo: ', result)
    return result.Items
    //const items = result.Items
  } catch(error) {
    console.error(error)
    return '[]'    
  }
  
}

export async function deleteTodoByTodoId(todoId) {

  const deleteParams = {
    TableName: todoTable,
    Key: {
      todoId: todoId
    }
  }

  const result = await dynamoDbClient.delete(deleteParams)
  const items = result.Items
  return items
}

export async function deleteFileEntryByFileId(fileId) {

  const deleteParams = {
    TableName: filesTable,
    Key: {
      fileId: fileId
    }
  }

  const result = await dynamoDbClient.delete(deleteParams)
  const items = result.Items
  return items
}

export async function getFileInfo(fileID) {
  const params = {
      TableName: filesTable,
      KeyConditionExpression: 'fileId = :fileId',
      ExpressionAttributeValues: {
          ':fileId': fileID
      },
      ScanIndexForward: false
  }
  //.promise();
  const result = await dynamoDbClient.query(params)
  const items = result.Items;
  return items[0];
}

export async function updateAttachmentUrl(inDBEntry,inAttachmentUrl){
  console.log('createFileRecords()::updateAttachmentUrl')
  console.log(inDBEntry)

  inDBEntry.attachmentUrl = inAttachmentUrl
  console.log(inDBEntry)
  await dynamoDbClient.put({
    TableName: todoTable,
    Item: inDBEntry
  })
}