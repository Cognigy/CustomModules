const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

/**
 * Detects the language of a given text
 * @arg {CognigyScript} `text` The text to detect
 * @arg {Boolean} `fullResults` Store full results (true) or only the winning language (false)
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function detect(input: IFlowInput, args: { text: string, fullResults: boolean, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.text) return Promise.reject("No text defined.");

	return new Promise((resolve, reject) => {
		let result = {};
		try {
			const detected = lngDetector.detect(args.text);
			if (detected.length > 0) {
				const detectedres = { "result": lngDetector.detect(args.text) };
				if (args.fullResults) result = { "result": detectedres };
				else result = detectedres.result[0][0];
			} else {
				if(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFCF3\uFE70-\uFEFC]/.test(args.text)) {
					if (args.fullResults) result = { "result": "arabic" };
					else result = "arabic";
					// result = { "result": "arabic" };
				} else {
					if (args.fullResults) result = { "result": "unknown" };
					else result = "unknown";
				}
			}
		} catch (err) {
			if (args.stopOnError) { reject(err); return; }
			else result = { "error": err.message };
		}

		// if not rejected before, write the result buffer to the Context or Input object
		if (args.writeToContext) input.context.getFullContext()[args.store] = result;
		else input.input[args.store] = result;
		resolve(input);
	});
}

// You have to export the function, otherwise it is not available
module.exports.detect = detect;