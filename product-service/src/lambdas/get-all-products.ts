import { APIGatewayProxyHandler } from "aws-lambda";
import { createDbClient } from  "../pg-db-client";
import {Client, QueryResult} from "pg";
import { product } from '../models/Product';


export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log(event);
  const getProductsListQuery = 'select id, description, price, title, image, count from products left join stocks on products.id=stocks.product_id;';
  const client: Client = createDbClient();
  try {
    await client.connect();
    const { rows: products }: QueryResult<product> = await client.query(getProductsListQuery);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: error.message
    };
  } finally {
      await client.end();
  }
};
