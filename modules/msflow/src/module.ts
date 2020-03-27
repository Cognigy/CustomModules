import * as request_promise from 'request-promise';

function _handleError(input: IFlowInput, error: Error, stopOnError: boolean, writeToContext: boolean, store: string): IFlowInput | {} {
    input.actions.log("error", error.message);

    if (writeToContext) {
        input.context.getFullContext()[store] = { "error": error };
    } else {
        input.input[store] = { "error": error };
    }

    if (stopOnError) {
        return Promise.reject(error.message);
    } else {
        return input;
    }

}

/**
 * Describes the function
 * @arg {CognigyScript} `flowURL` The URL of the MS Flow to call
 * @arg {JSON} `payload` The payload to send
 * @arg {CognigyScript} `callbackURL` The URL to pass to Flow for calling back Cognigy.AI
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function startFlow(input: IFlowInput, args: { flowURL: string, payload: any, callbackURL: string,  writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	try {
        // Set payload according to whether it's a pure call or contains callback information
		let payload = args.payload;
		if (args.callbackURL) {
			payload = Object.assign({
				"userId": input.input.userId,
				"sessionId": input.input.sessionId,
				"URLToken": input.input.URLToken,
				"callbackURL": args.callbackURL
			  }, payload);
		}

		// set options for the call
		const options: request_promise.OptionsWithUri = {
            uri: args.flowURL,
            json: true,
            body: payload,
        };

        // POST Request to MS Flow
        let result = await request_promise.post(options);

        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;
    } catch (error) {
        return _handleError(input, error.error, args.stopOnError, args.writeToContext, args.store);
    }
}

// You have to export the function, otherwise it is not available
module.exports.startFlow = startFlow;