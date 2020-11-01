import { APIGatewayProxyHandler } from "aws-lambda";
const productList = require('./productList.json');

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { pathParameters: { id } } = event;

    const product = productList.find((product) => product.id === id);

    if (!product) {
      throw ({ message: 'Product not found', statusCode: 404 })
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(product),
      };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: error.message
    };
  }
};