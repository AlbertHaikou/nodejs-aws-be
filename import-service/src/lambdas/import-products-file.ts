import {APIGatewayProxyHandler} from "aws-lambda";
import {S3} from "aws-sdk";

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const BUCKET = 'aws-nodejs-app-uploaded';
  const fileName = event.queryStringParameters.name;
  if (!fileName) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
        'Access-Control-Allow-Origin': '*'
      },
      body: 'File name is missing'
    }
  }
  const filePath = `uploaded/${fileName}`;
  const s3 = new S3({region: 'eu-west-1', signatureVersion: 'v4'})

  const params = {
    Bucket: BUCKET,
    Key: filePath,
    Expires: 60,
    ContentType: 'text/csv'
  }

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
        'Access-Control-Allow-Origin': '*'
      },
      body: signedUrl
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: error.message
    };
  }
}