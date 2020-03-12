import axios from 'axios';


/**
 * This node starts a specific Blue Prism process.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `processWSDL` The exposed process endpoint url
 * @arg {CognigyScriptArray} `soapXMLBody` The SOAP body to fill in required process variables
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function startProcess(input: any, args: { secret: CognigySecret, processWSDL: string, soapXMLBody: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, processWSDL, soapXMLBody, contextStore, stopOnError } = args;
  const { username, password } = secret;

  if (!secret) throw new Error('No secret defined.');
  if (!processWSDL) throw new Error('No Blue Prism Process Web Service WSDL defined.');
  if (!soapXMLBody) throw new Error('No SOAP XML Body defined. It is needed for starting the process and filling the variables, for example.');
  if (!contextStore) throw new Error('No Cognigy context store key defined. It is needed to store the request result into the context object.');

  if (!username) throw new Error("The secret is missing the 'username' key. Add it with the Blue Prism user's username");
  if (!password) throw new Error("The secret is missing the 'password' key. Add it with the Blue Prism user's password");

  try {

    const response = await axios({
      method: 'post',
      url: processWSDL,
      headers: {
        'SOAPAction': '"http://www.aiasoftware.com/cloud/v1/compose/pdf/v1"',
        'Content-Type': 'text/xml',
      },
      auth: {
        username,
        password
      },
      data: soapXMLBody
    });

    input.actions.addToContext(contextStore, response.data, 'simple');
  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message}, 'simple');
    }
  }

  return input;
}
module.exports.startProcess = startProcess;


/**
 * (IN DEVELOPMENT!) This node starts a specific Blue Prism process async.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `processWSDL` The exposed process endpoint url
 * @arg {CognigyScriptArray} `soapXMLBody` The SOAP body to fill in required process variables
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function startProcessAsync(input: IFlowInput, args: { secret: CognigySecret, body: JSON, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, body, contextStore, stopOnError } = args;
  const { username, password, api_key } = secret;

  if (!secret) throw new Error('No secret defined.');
  if (!body) throw new Error('No body is not defined. Please take a look at the README.');
  if (!contextStore) throw new Error('No Cognigy context store key defined. It is needed to store the request result into the context object.');

  if (!username) throw new Error("The secret is missing the 'username' key. Add it with the Blue Prism user's username");
  if (!password) throw new Error("The secret is missing the 'password' key. Add it with the Blue Prism user's password");


  // Check if the secret is given
  if (!api_key) throw new Error("The secret is missing the 'api_key' field.");

  try {
      const response = await axios.post(`https://request-forwarder.cognigy.ai/forward`, body, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': api_key
          }
      });

      input.actions.addToContext(contextStore, response.data, 'simple');
  } catch (error) {
      if (stopOnError) {
          throw new Error(error.message);
      } else {
          input.actions.addToContext(contextStore, { error: error.message }, 'simple');
      }
  }

  return input;
}
module.exports.startProcessAsync = startProcessAsync;