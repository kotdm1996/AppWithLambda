
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.js'

//dktest
const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todoTable = process.env.TODO_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const itemId = uuidv4()

  const newTodo = JSON.parse(event.body)

  console.log('dktest-1')
  console.log('event.headers.Authorization = ' +  event.headers.Authorization)
  
  const authorization = event.headers.Authorization
  const userId = getUserId(event)
  const createdAt = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()
  const newItem = {
    todoId: itemId,
    userId: userId,
    createdAt: createdAt,
    done: false,
    attachmentUrl: "",
    ...newTodo
  }

  console.info('DKTEST BEFORE SAVING')
  await dynamoDbClient.put({
    TableName: todoTable,
    Item: newItem
  })

  console.info('DKTEST AFTER SAVING BEFORE RETURNING')
  const returnItem = { item: {
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    todoId: itemId,
    userId: userId,
    done: false,
    createdAt: createdAt,
    attachmentUrl: ""
  }}
    
  

  //JSON.stringify(returnItem)
  console.debug('Printing returning item ===> ' + JSON.stringify(returnItem))
  return  {
    statusCode: 201,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(returnItem)
  }
  

  /**
  const scanCommand = {
    TableName: todoTable
  }

  const result = await dynamoDbClient.scan(scanCommand)
  const items = result.Items

  //console.info('DKTEST BEFORE SENDING TODOs to Client')
  //console.info(JSON.stringify({items}))
  console.info('=====================================')
  return {
    statusCode: 201,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify({
      items
    })
  }
 ***/
  
  /*
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
    */
  
}

