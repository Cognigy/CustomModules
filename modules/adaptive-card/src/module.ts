import * as ac from 'adaptivecards';


/**
 * Deployment Node that takes a file id for a bot, and deploys it on one or more devices via device ids.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `fileId` The file id for a bot
 * @arg {CognigyScriptArray} `deviceIds` The ids of the devices where you want to deploy the bot
 * @arg {JSON} `botVariables` The variables your AA bot uses
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function createAdapticveCard(input: any, args: { secret: CognigySecret, fileId: string, deviceIds: string[], botVariables: object, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { contextStore, stopOnError } = args;
  const { fileId, deviceIds, botVariables } = args;
  if (!fileId) throw new Error('No file id defined.');
  if (!deviceIds) throw new Error('No device ids defined.');

  let card = new ac.AdaptiveCard();

  input.actions.addToContext(contextStore, "", 'simple');

  return input;
}

module.exports.createAdapticveCard = createAdapticveCard;
