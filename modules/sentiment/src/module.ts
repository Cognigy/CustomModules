const Sentiment = require('sentiment');

/**
 * Gives sentiment of the text
 */
async function sentiment(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {
    
    const sent = new Sentiment();
    const text = input.input.text;
    const result = sent.analyze(text);

    return new Promise(resolve => {
        input.actions.addToContext('sentiment', result, 'simple');
        resolve(input);
    });
}

module.exports.sentiment = sentiment