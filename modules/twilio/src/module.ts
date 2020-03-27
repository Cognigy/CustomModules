import * as Twilio from 'twilio';

/**
 * Sends an SMS
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `from` Phone number of the sender
 * @arg {CognigyScript} `to` Phone number of the recipient
 * @arg {CognigyScript} `body` SMS Body
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function sendSMS(input: IFlowInput, args: { secret: any, body: string, from: string, to: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.accountSid || !args.secret.authToken) return Promise.reject('Secret not present or keys missing (accountSid, authToken)');

	if (!args.from) return Promise.reject("Sender paramter -from- missing.");
	if (!args.to) return Promise.reject("Recipient paramter -to- missing.");
	if (!args.body) return Promise.reject("SMS body missing or empty.");
	if (args.body.length > 1600) return Promise.reject("SMS body too long (max 1600 characters).");

	let result = null;
	try {
		const client = Twilio(args.secret.accountSid, args.secret.authToken);

		result = await client.messages.create({from: args.from, body: args.body, to: args.to});
	} catch (err) {
		if (args.stopOnError) { return Promise.reject(err.message); }
		result = { "error": err.message};
	}

	if (args.writeToContext) input.context.getFullContext()[args.store] = result;
	else input.input[args.store] = result;

	return input;
}

// You have to export the function, otherwise it is not available
module.exports.sendSMS = sendSMS;
