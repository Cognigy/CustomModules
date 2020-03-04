const {SentimentManager} = require('node-nlp');
const {Language} = require('node-nlp');

/**
 * Gives sentiment of the text
 * @arg {select[ar,hy,bn,eu,ca,zh,cs,da,nl,en,fa,fi,fr,gl,de,el,hi,hu,id,ga,it,ja,ko,lt,ms,ne,no,pl,pt,ro,ru,sr,sl,es,sv,tl,ta,th,tr,uk]} `language` of the text
 */
async function multi_sentiment(input: IFlowInput, args: {language: string}): Promise<IFlowInput | {}> {

    const language = new Language();
    const sent = new SentimentManager();
    const text = input.input.text;
    const guess = language.guess(text,[args.language],);
    const lang = guess[0]['alpha2']

    const result = await sent.process(lang,text);

    return new Promise(resolve => {
        input.actions.addToContext('sentiment', result, 'simple');
        resolve(input);
    });
}

module.exports.multi_sentiment = multi_sentiment