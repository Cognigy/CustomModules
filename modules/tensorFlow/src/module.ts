const npmModel = require('@tensorflow-models/toxicity');
/**
 * Template for usage of a TensorFlow.js module in a Custom Module
 * @arg {CognigyScript} `text` The text that should be classified
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop the flow on an error
 */
async function classifyText(input: IFlowInput, args: { text: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

	const { text, contextStore, stopOnError } = args;

	if (!text) throw new Error("The input text is not defined. You can use CognigyScript to access the user input: {{ci.text}}.");
	if (!contextStore) throw new Error("No context store key is defined. You have to define where to store the node response in the Cogngiy Context.");

	try {
		// load the model
		const model = await npmModel.load();

		// use the model on the input text as described in the documentation
		const result = await model.classify(text);

		input.actions.addToContext(contextStore, result, 'simple');
	} catch (error) {
		if (stopOnError) {
			throw new Error(error.message);
		} else {
			input.actions.addToContext(contextStore, { error: error.message }, 'simple');
		}
	}

	return input;
}

module.exports.classifyText = classifyText;
