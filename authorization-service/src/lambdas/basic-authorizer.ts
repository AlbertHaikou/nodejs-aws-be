import {APIGatewayAuthorizerHandler, APIGatewayTokenAuthorizerEvent} from 'aws-lambda';


const generatePolicyDocument = (effect, resourceArn) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resourceArn,
    }
  ]
});

export const basicAuthorizer: APIGatewayAuthorizerHandler = (event: APIGatewayTokenAuthorizerEvent, _context, callback) => {
  console.log(event);
  const {authorizationToken} = event;
  if (!authorizationToken) {
    return callback('Unauthorized');
  }
  try {
    const encodedCredentials = authorizationToken.split(' ')[1];
    const credentialsBuffer = Buffer.from(encodedCredentials, 'base64');
    const [username, password] = credentialsBuffer.toString('utf-8').split(':');
    const effect = username === process.env.TEST_USER && password === process.env.TEST_PASSWORD ? 'Allow' : 'Deny';
    const policyDocument = generatePolicyDocument(effect, event.methodArn);
    return callback(null, {
      principalId: null,
      policyDocument,
    });
  } catch (err) {
    return callback('Unauthorized');
  }
};