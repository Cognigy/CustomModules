const axios = require('axios')

/**
 * Finds a Contact by their eMail address in Hubspot
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function tellJoke(input: IFlowInput, args: { contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

	const { contextStore, stopOnError } = args;

	if (!contextStore) throw new Error("The node is missing the 'contextStore' parameter.");
	
	input.actions.say('Draussen ist kaelter als im Winter.', null);

	return input;
}

module.exports.tellJoke = tellJoke;