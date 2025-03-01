import { getEntryByTodoId, getFileInfo, updateAttachmentUrl } from '../dataLayer/dynamoUtils.js'
//deleteFileEntryByFileId
export async function processFileSavedCallback(inRecord) {

  console.log("DKTEST ==================================== DKTEST")
  console.log(JSON.stringify(inRecord.userIdentity))
  console.log("DKTEST ==================================== DKTEST")
  console.log(JSON.stringify(inRecord.requestParameters))
  console.log("DKTEST ==================================== DKTEST")
  console.log(JSON.stringify(inRecord.responseElements))
  console.log("DKTEST ==================================== DKTEST")
  console.log(JSON.stringify(inRecord.s3))
  console.log("DKTEST ==================================== DKTEST")
  console.log("DKTEST ==================================== DKTEST")
  console.log("DKTEST ==================================== DKTEST")
  console.log("DKTEST ==================================== DKTEST")
  console.log("inRecord.s3.object.key ===> " + inRecord.s3.object.key)
  const newly_created_file_info = await getFileInfo(inRecord.s3.object.key)
  
  console.log(newly_created_file_info)

  const entry_to_update = await getEntryByTodoId(newly_created_file_info.todoId)

  console.log(entry_to_update)

  updateAttachmentUrl(entry_to_update,newly_created_file_info.fileUrl )
}