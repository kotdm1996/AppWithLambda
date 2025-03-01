import {processFileSavedCallback} from '../../businessLogic/todo_s3_event.js'

//handler
export async function handler(event) {
  console.log('Processing event createFileRecord(): ', event)
  
  for (const record of event.Records) {
    //await processFile(record)
    await processFileSavedCallback(record)
  } 
}
