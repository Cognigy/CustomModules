const toxi = require('@tensorflow-models/toxicity');

/**
 * Gives toxicity of the text
 */
async function toxicity(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {
    const model = await toxi.load(0.9);
    const text = input.input.text;
    const predictions = await model.classify(text);

    return new Promise(resolve => {
        input.actions.addToContext('toxicity', predictions, 'simple');
        resolve(input);
    });
}

module.exports.toxicity = toxicity