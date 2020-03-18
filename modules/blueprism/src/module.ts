import axios from 'axios';


/**
 * This node starts a specific Blue Prism process.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `processWSDL` The exposed process endpoint url
 * @arg {CognigyScript} `processName` The name of the exposed process
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function startProcess(input: any, args: { secret: CognigySecret, processWSDL: string, processName: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, processWSDL, processName, contextStore, stopOnError } = args;
  const { username, password } = secret;

  if (!secret) throw new Error('No secret defined.');
  if (!processWSDL) throw new Error('No Blue Prism Process Web Service WSDL defined.');
  if (!processName) throw new Error('No process name defined.');
  if (!contextStore) throw new Error('No Cognigy context store key defined. It is needed to store the request result into the context object.');

  if (!username) throw new Error("The secret is missing the 'username' key. Add it with the Blue Prism user's username");
  if (!password) throw new Error("The secret is missing the 'password' key. Add it with the Blue Prism user's password");

  try {

    const response = await axios({
      method: 'post',
      url: processWSDL,
      headers: {
        'Content-Type': 'text/xml'
      },
      auth: {
        username,
        password
      },
      data: `
      <soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:urn="urn:blueprism:webservice:${processName}">
          <soapenv:Header/>
          <soapenv:Body>
            <urn:${processName} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
          </soapenv:Body>
      </soapenv:Envelope>
      `
    });

    input.actions.addToContext(contextStore, response.data, 'simple');
  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.log('error', 'Error in BluePrism - Start Process: ' + error);
      input.actions.addToContext(contextStore, { error: error.message}, 'simple');
    }
  }

  return input;
}
module.exports.startProcess = startProcess;