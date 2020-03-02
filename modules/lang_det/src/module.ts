const langdetect = require('langdetect');

/**
 * Identifies the language of the written text
 */
async function language(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {
    
    const text = input.input.text;
    const result = langdetect.detect(text);

    return new Promise(resolve => {
        input.actions.addToContext('language', result, 'simple');
        resolve(input);
    });
}

module.exports.language = language