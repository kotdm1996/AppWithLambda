import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../lambda/utils.js'
import { createLogger } from '../utils/logger.mjs'
import {createNewTodoInDB} from '../dataLayer/dynamoUtils.js'

const logger = createLogger('createTodo')

export async function create_new_todo(event) {
  console.log('Processing event: ', event)
  const itemId = uuidv4()

  const newTodo = JSON.parse(event.body)

  console.log('dktest-1')
  console.log('event.headers.Authorization = ' +  event.headers.Authorization)
  logger.info('dktest-1')
  logger.info('event.headers.Authorization = ' +  event.headers.Authorization)

  
  const userId = getUserId(event)
  const createdAt = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()
  const newItem = {
    todoId: itemId,
    userId: userId,
    createdAt: createdAt,
    done: false,
    attachmentUrl:'',
    ...newTodo
  }

  console.info('DKTEST BEFORE SAVING')

  await createNewTodoInDB(newItem)
  
  console.info('DKTEST AFTER SAVING BEFORE RETURNING')
  const returnItem = { item: {
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    todoId: itemId,
    userId: userId,
    done: false,
    createdAt: createdAt,    
  }}
    
  

  console.debug('Printing returning item ===> ' + JSON.stringify(returnItem))
  return  {
    statusCode: 201,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(returnItem)
  }
  
}
