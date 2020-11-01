import { APIGatewayProxyHandler } from "aws-lambda";
const productList = require('./productList.json');

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { pathParameters: { id } } = event;

    const product = productList.find((product) => product.id === id);

    if (product) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(product),
      };
    }

    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Page not found",
    };
  } catch (error) {
    throw Error("Internal Server Error");
  }
};