const npm_model = require('@tensorflow-models/toxicity')
/**
 * Template for usage of a TensorFlow.js module in a Custom Module
 */
async function function_name(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {
	//load the model
	const model = await npm_model.load();
	//get the sentence from IFlowInput
	const text = input.input.text;
	//use the model on the input text as described in the documentation
	const result = await model.classify(text);

	return new Promise(resolve => {
		//write the result into the context
        input.actions.addToContext('name', result, 'simple');
        resolve(input);
    });
}
// You have to export the function, otherwise it is not available
module.exports.function_name = function_name;