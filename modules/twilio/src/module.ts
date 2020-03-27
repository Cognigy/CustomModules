import * as Twilio from 'twilio';

/**
 * Sends an SMS
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `from` Phone number of the sender
 * @arg {CognigyScript} `to` Phone number of the recipient
 * @arg {CognigyScript} `body` SMS Body
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function sendSMS(input: IFlowInput, args: { secret: any, from: string, to: string, body: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	
	const { secret, body, from, to , contextStore, stopOnError } = args;
	const { accountSid, authToken } = secret;

	if (!body) throw new Error("SMS body missing or empty.");
	if (body.length > 1600) throw new Error("SMS body too long (max 1600 characters).");
	if (!from) throw new Error("The sender is missing. Define the 'from' field.");
	if (!to) throw new Error("The receiver is missing. Define a 'to' field.");
	if (!contextStore) throw new Error("The context store key is missing. You have to define where to store the response in the Cognigy Context object.");

	if (!secret) throw new Error("The secret is missing. You have to define the 'accountSid' and 'authToken'.");
	if (!accountSid) throw new Error("The secret is missing the 'accountSid' field.");
	if (!authToken) throw new Error("The secret is missing the 'authToken' field.");

	let result = null;
	try {
		const client = Twilio(accountSid, authToken);

		result = await client.messages.create({
			from,
			body, 
			to
		});

	} catch (err) {
		if (args.stopOnError) { return Promise.reject(err.message); }
		result = { "error": err.message};
	}

	input.actions.addToContext(contextStore, result, 'simple');

	return input;
}

module.exports.sendSMS = sendSMS;
