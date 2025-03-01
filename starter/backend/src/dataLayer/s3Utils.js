import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()
const bucketName = process.env.FILES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function generateFileUrl(fileId)
{
    return  `https://${bucketName}.s3.amazonaws.com/${fileId}`
}

export async function deleteS3Entry(inDeleteS3Path)
{
    const url = new URL(inDeleteS3Path);
    const bucketName = url.hostname.split('.')[0]; // Extract bucket name
    const objectKey = decodeURIComponent(url.pathname.slice(1)); // Extract object key

   
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    });

    try {
        await s3Client.send(command)
        console.log(`Successfully deleted ${inDeleteS3Path}`);
    } catch (error) {
        console.error("Error deleting object:", error);
    }
}

export async function getUploadUrl(fileId) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileId
    })
  
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: urlExpiration
    })
    return url
}