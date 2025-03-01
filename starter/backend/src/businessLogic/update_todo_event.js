import { todoExists, updateTodoTableEntryStatus } from '../dataLayer/dynamoUtils.js'
import { getUserId } from '../lambda/utils.js'

export async function update_todo_event(event)
{
    
    console.log('Processing event: ', event)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const validTodoId = await todoExists(todoId, userId)

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
    
    await updateTodoTableEntryStatus(todoId, userId, updateJson.done)
    
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

  }
