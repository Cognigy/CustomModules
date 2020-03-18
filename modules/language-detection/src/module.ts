const langdetect = require('langdetect');

/**
 * Identifies the language of the written text
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 */
async function language(input: IFlowInput, args: {store: string,  writeToContext: boolean}}): Promise<IFlowInput | {}> {
    
    const text = input.input.text;
    const result = langdetect.detect(text);

    return new Promise(resolve => {
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
	    else input.input[args.store] = result;
	    resolve(input);
    });
}

module.exports.language = language
