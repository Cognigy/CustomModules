const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();

/**
 * Detects the language of a given text
 * @arg {CognigyScript} `text` The text to detect
 * @arg {Boolean} `fullResults` Store full results (true) or only the winning language (false)
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function detectLanguage(input: IFlowInput, args: { text: string, fullResults: boolean, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

	const { text, fullResults, contextStore, stopOnError } = args;

	if (!text) throw new Error("No text defined.");
	if (!contextStore) throw new Error("No context store defined.");

	try {
		const detected = lngDetector.detect(text);

		if (detected.length > 0) {

			const detectedres = {
				"result": lngDetector.detect(text)
			};

			// check if the full result should be returned or not
			if (fullResults) {
				input.actions.addToContext(contextStore, detectedres, 'simple');
			} else {
				input.actions.addToContext(contextStore, detectedres.result[0][0], 'simple');
			}

		} else {
			if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFCF3\uFE70-\uFEFC]/.test(text)) {
				input.actions.addToContext(contextStore, { result: "arabic" }, 'simple');
			} else {
				input.actions.addToContext(contextStore, { result: "unkown" }, 'simple');
			}
		}
	} catch (error) {
		if (stopOnError) {
			throw new Error(error.message);
		} else {
			input.actions.addToContext(contextStore, { error: error.message }, 'simple');
		}
	}

	return input;
}

// You have to export the function, otherwise it is not available
module.exports.detectLanguage = detectLanguage;