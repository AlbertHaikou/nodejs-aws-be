import {S3, SQS} from "aws-sdk";
import * as csv from 'csv-parser';

export const importFileParser = (event) => {
  const BUCKET = 'aws-nodejs-app-uploaded';
  console.log('importFileParser triggered: ', event);

  const s3 = new S3({region: 'eu-west-1'});
  const sqs = new SQS({region: 'eu-west-1'})

  event.Records.forEach(record => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    s3Stream.pipe(csv())
      .on('data', (data) => {
        console.log(data);
        sqs.sendMessage({
          QueueUrl: process.env.CATALOG_SQS_URL,
          MessageBody: JSON.stringify(data)
        }, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Send message to ${process.env.CATALOG_SQS_URL} with result: ${result}`);
          }
        });
      })
      .on('end', async () => {
        await s3.copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed')
        }).promise().then(() => {
          s3.deleteObject({
            Bucket: BUCKET,
            Key: record.s3.object.key
          }, () => {
            console.log(`${record.s3.object.key.split('/')[1]} is parsed`);
          });
        })
      });
  });
}