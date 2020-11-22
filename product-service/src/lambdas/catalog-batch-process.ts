import {SNS} from "aws-sdk";
import {createDbClient} from "../pg-db-client";
import {Client} from "pg";

export const catalogBatchProcess = async (event) => {
  console.log(event);

  const sns = new SNS({region: "eu-west-1"});

  try {
    const addProductQuery = 'insert into products (title, description, price, image) values ($1, $2, $3, $4) returning id;';
    const addStockQuery = 'insert into stocks (product_id, count) values ($1, $2);';

    const products = event.Records.map(({body}) => JSON.parse(body));

    const client: Client = createDbClient();
    try {
      await client.connect();
      await client.query('BEGIN');
      for (const product of products) {
        const {title, count, description, price, image} = product;
        const currentProduct = await client.query(addProductQuery, [title, description, price, image]);
        const productId: string = currentProduct.rows[0].id;
        await client.query(addStockQuery, [productId, count]);
      }
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK');
    } finally {
      await client.end();
    }

    await sns.publish({
      Subject: 'New bicycles in the catalog!',
      Message: JSON.stringify(products),
      TopicArn: process.env.AWS_SNS_ARN,
    }).promise();

    console.log('Notification is sent');
  } catch (err) {
    console.log(err);
  }
};