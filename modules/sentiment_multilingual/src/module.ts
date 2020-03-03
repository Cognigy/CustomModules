const {SentimentManager} = require('node-nlp');
const {Language} = require('node-nlp');

/**
 * Gives sentiment of the text
 */
async function multi_sentiment(input: IFlowInput, args: {}): Promise<IFlowInput | {}> {

    const language = new Language();
    const sent = new SentimentManager();
    const text = input.input.text;
    const guess = language.guess(text,['de','en'],);
    const lang = guess[0]['alpha2']

    const result = await sent.process(lang,text);

    return new Promise(resolve => {
        input.actions.addToContext('sentiment', result, 'simple');
        resolve(input);
    });
}

module.exports.multi_sentiment = multi_sentiment
