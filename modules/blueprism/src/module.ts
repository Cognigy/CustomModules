import axios from 'axios';


/**
 * Deployment Node that takes a file id for a bot, and deploys it on one or more devices via device ids.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `fileId` The file id for a bot
 * @arg {CognigyScriptArray} `deviceIds` The ids of the devices where you want to deploy the bot
 * @arg {JSON} `botVariables` The variables your AA bot uses
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function deployAutomation(input: any, args: { secret: CognigySecret, fileId: string, deviceIds: string[], botVariables: object, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { contextStore, stopOnError, username, password, url } = validateArgs(args);
  const { fileId, deviceIds, botVariables } = args;
  if (!fileId) throw new Error('No file id defined.');
  if (!deviceIds) throw new Error('No device ids defined.');

  try {
    const options  = await authenticate(input, true, url, username, password, fileId, deviceIds, botVariables, contextStore, stopOnError);

    const response = await axios({
      method: 'post',
      url: `${url}/v2/automations/deploy`,
      headers: { 'X-Authorization': options['headers']['X-Authorization'] },
      data: options['body']
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
module.exports.deployAutomation = deployAutomation;