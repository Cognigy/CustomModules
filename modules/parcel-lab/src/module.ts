import axios from 'axios';

/**
 * Get parcel information for a specific order number.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `orderNumber` The file id for a bot
 * @arg {Select[de,en]} `language` The ids of the devices where you want to deploy the bot
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getParcelInfo(input: any, args: { secret: CognigySecret, orderNumber: string, language: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, orderNumber, language, contextStore, stopOnError } = args;
  const { user } = secret;

  if (!secret) throw new Error('No secret defined.');
  if (!orderNumber) throw new Error('No orderNumber defined.');
  if (!contextStore) throw new Error('No device ids defined.');
  if (!user) throw new Error("The secret is missing the 'user' field.");

  try {

    const response = await axios({
      method: 'get',
      url: `https://api.parcellab.com/v2/checkpoints/?user=${user}&orderNo=${orderNumber}&lang=${language}`,
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
module.exports.getParcelInfo = getParcelInfo;

