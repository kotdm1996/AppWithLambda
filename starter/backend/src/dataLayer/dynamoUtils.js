import { DynamoDB , QueryCommand} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)

const todoTable = process.env.TODO_TABLE
const filesTable = process.env.FILES_TABLE

export async function createNewTodoInDB(inTodoNewObject)
{
  try
  {
    const insertStatus = await dynamoDbClient.put({
      TableName: todoTable,
      Item: inTodoNewObject
    })
    console.log(insertStatus)
  }
  catch(error) {
    console.log(error)
  }
}

export async function insertIntoFileDb(inNewFileItem)
{
  try
  {
    const insertStatus = await dynamoDbClient.put({
      TableName: filesTable,
      Item: inNewFileItem
    })
    console.log(insertStatus)
  }
  catch(error) {
    console.log(error)
  }
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

export async function getAllEntriesByUidIdNewTry(userId) {

  console.log("getAllEntriesByUidIdNewTry() ==> " + userId)
 
  const params = {
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {':userId': userId}
  }
  
  console.log(JSON.stringify(params))

try {
  const result = await dynamoDbClient.query(params)
  
  const items = result.Items

  console.log(JSON.stringify(items))
  return {
      statusCode: 200,
      body: JSON.stringify({items}) // Return the queried items
  }
} catch (error) {
  console.error("Unable to query. Error:", error);
  return {
      statusCode: 500,
      body: '[]'
  }
}
}

export async function getAllFilesEntriesByTodoIdNewTry(todoId) {

  console.log("getAllEntriesByTodoIdIdNewTry() ==> " + todoId)
 
  const params = {
    TableName: filesTable,
    IndexName: 'TodoIndex',
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {':todoId': todoId}
}
console.log(params)
console.log("=========================================================")

  //const result = await dynamoDbClient.query(params)
  //const items = result.Items
  //console.log(JSON.stringify({items}))
  /*
  const returnStatusCode = 500
  const returnBody = '[]'

  await dynamoDbClient.query(params).then(result => { 
    const items = result.Items
    console.log("INSDIE getAllEntriesByTodoIdIdNewTry() - got something back")
    console.log(JSON.stringify({items}))
    returnBody = JSON.stringify({items})
    returnStatusCode = 200    
  })
  .catch(error => {
    console.error("Unable to query. Error:", error);    
  })
  */
 try {
    const dbResult = await dynamoDbClient.query(params)
    const items = dbResult.Items
    console.log(JSON.stringify({items}))
    return {
      statusCode: 200,
      body: JSON.stringify({items})
    }
 } catch (error){
  console.error("Error retrieving items:", error);
  return {
    statusCode: 500,
    body: '[]'
  }
 }
  return {
    statusCode: returnStatusCode,
    body: returnBody
  }
}

export async function getTodoDataForToDoId12345(inTodoId) {
  const tableName = filesTable;
  const keyConditions = {todoId: inTodoId }

  //todoId: "someTodoId"   // Example sort key (if applicable)

  return await genericDbQuery(tableName, keyConditions)
}

export async function getTodoDataForUser12345(inUserId) {
  const tableName = todoTable;
  const keyConditions = {userId: inUserId }

  //todoId: "someTodoId"   // Example sort key (if applicable)

  return await genericDbQuery(tableName, keyConditions)
}

export async function genericDbQuery(tableName, keyConditions) {
      // Start building the query parameters
      const params = {
        TableName: tableName,
        KeyConditionExpression: '',
        ExpressionAttributeValues: {}
    };

    // Dynamically build the KeyConditionExpression and ExpressionAttributeValues
    const expressions = [];
    for (const [key, value] of Object.entries(keyConditions)) {
        const expressionKey = `:${key}`; // Create a placeholder for the value
        expressions.push(`${key} = ${expressionKey}`); // Build the condition
        params.ExpressionAttributeValues[expressionKey] = value; // Set the value in the map
    }

    // Join the expressions with " AND " if there are multiple conditions
    params.KeyConditionExpression = expressions.join(' AND ');

    try {
        const result = await dynamoDB.query(params).promise();
        console.log("Query succeeded:", result.Items);
        return result.Items;
    } catch (error) {
        console.error("Unable to query. Error:", error);
        throw error;
    }
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

export async function deleteTodoByTodoId(todoId, userId) {

  const deleteParams = {
    TableName: todoTable,
    Key: {
      todoId: todoId,
      userId: userId
    }
  }

  console.log(JSON.stringify(deleteParams))
  const result = await dynamoDbClient.delete(deleteParams)
  console.log(JSON.stringify(result))
  const items = result.Items
  return items
}

export async function deleteFileIdByTodoIds(todoId, fileId) {

  const deleteParams = {
    TableName: filesTable,
    Key: {
      todoId: todoId,
      fileId: fileId
    }
  }

  console.log(JSON.stringify(deleteParams))
  const result = await dynamoDbClient.delete(deleteParams)
  console.log(JSON.stringify(result))
  const items = result.Items
  return items
}

/*
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
*/

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

export async function updateTodoTableEntryStatus(inTodoId, inUid, inStatus)
{

  const paramsForUpdate = {
    TableName: todoTable,
    Key:{"todoId": inTodoId,"userId": inUid},
    UpdateExpression: "set done = :doneStatus",            
    ExpressionAttributeValues: {':doneStatus':inStatus},
    ReturnValues:"UPDATED_NEW"
  }

  const resultUpdate = await dynamoDbClient.update(paramsForUpdate)
  console.log(resultUpdate)
}