import { APIGatewayProxyHandler } from "aws-lambda";
const productList = require('./productList.json');

export const getProductsList: APIGatewayProxyHandler = async (_event, _context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(productList),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: error.message
    };
  }
};
