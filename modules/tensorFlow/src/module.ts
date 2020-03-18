const npmModel = require('@tensorflow-models/toxicity')
/**
 * Template for usage of a TensorFlow.js module in a Custom Module
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 */
async function functionName(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {
	//load the model
	const model = await npmModel.load();
	//get the sentence from IFlowInput
	const text = input.input.text;
	//use the model on the input text as described in the documentation
	const result = await model.classify(text);

	return new Promise(resolve => {
		//write the result to the Context or Input object
        	if (args.writeToContext) input.context.getFullContext()[args.store] = result;
	 	else input.input[args.store] = result;
	        resolve(input);
    });
}
// You have to export the function, otherwise it is not available
module.exports.functionName = functionName;
