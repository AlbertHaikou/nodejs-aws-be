import { APIGatewayProxyHandler } from "aws-lambda";
import { createDbClient } from  "../pg-db-client";
import {Client, QueryResult} from "pg";
import { product } from '../models/Product';

export const addProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event);
  const { title, count, description, price, image } = JSON.parse(event.body);
  if (!title || !count || !description || !price || !image) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify('Invalid body'),
    }
  }

  const addProductQuery = 'insert into products (title, description, price, image) values ($1, $2, $3, $4) returning id;';
  const addStockQuery = 'insert into stocks (product_id, count) values ($1, $2);';
  const client: Client = createDbClient();
  try {
      await client.connect();

      await client.query('BEGIN');

      const product: QueryResult<product> = await client.query(addProductQuery, [title, description, price, image]);
      const productId: string = product.rows[0].id;
      await client.query(addStockQuery, [productId, count]);

      await client.query('COMMIT')

        return {
          statusCode: 201,
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify(`New product ${productId} is created`),
      }
  } catch (error) {
      await client.query('ROLLBACK');
      return {
          statusCode: error.statusCode || 500,
          body: error.message || 'Product was not created'
      }
  } finally {
      await client.end();
  }
};
