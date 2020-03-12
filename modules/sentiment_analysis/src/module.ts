const English = require('../AFINN_111.json');
const German = require('../polartlexicon.json');
const Spanish = require('../SentiCon.json')

const negations_en = ["don't", "doesn't", "dont", "doesnt", "not"];
const negations_de = ["nicht", "kein", "keine", "keiner", "keines", "keinem", "keinen"];
const negations_es = ["no", "sin", "nada", "nunca", "tampoco", "nadie"];

/**
 * Gives sentiment of the text
 * @arg {select[English,German,Spanish]} `language` of the input
 */
async function sentiment(input: IFlowInput, args: {language: string}): Promise<IFlowInput | {}> {

    if (!args.language) return Promise.reject("No language defined.");

    const language = args.language;

    let negations = [];
    
    const text = input.input.text;
    const tokens = text.split(' ');

    let dictionary = null;

    switch (language) {
        case 'German':
            dictionary = German;
            await process_german(tokens);
            negations = negations_de;
            break;
        case 'English':
            dictionary = English;
            negations = negations_en;
            break;
        case 'Spanish' :
            dictionary = Spanish;
            await process_spanish(tokens);
            negations = negations_es;
            break;
    }

    let score = 0;
    let wordSet = [];

    for (let token in tokens) {
        for (let word in dictionary) {
            if (tokens[token] === word) {
                wordSet.push(word+': '+dictionary[word]);
                score = score + dictionary[word];
            }
        }
    }
    
    const negation = [];

    for (let neg in negations){
        for (let token in tokens){
            if (tokens[token] == negations[neg]) {
                negation.push(tokens[token]);
                score = -score;
            }
        }
    }

    const verdict = score == 0 ? "NEUTRAL" : score < 0 ? "NEGATIVE" : "POSITIVE";

    const result = {
        verdict: verdict,
        score: score,
        comparative: score / tokens.length,
        foundWords: wordSet,
        negations: negation
    }
    console.log(result);

    return new Promise(resolve => {
        //console.log(result);
        input.actions.addToContext('sentiment', result, 'simple');
        resolve(input);
    });
}

const process_german = (tokens) => {
    const dictionary = German;
    for (let token in tokens) {
        for (let word in dictionary) {
            if (tokens[token].search(word) === 0 && tokens[token] !== word) {
                tokens[token] = tokens[token].replace(/test$|tet$|este$|ester$|estes$|esten$|estem$|ste$|ster$|stes$|stem$|sten$|st$|te$|t$|et$|est$|ere$|erer$|eres$|erem$|eren$|er$|es$|em$|en$|e$/, '');
                tokens[token] = tokens[token].replace(/ss/, 'ß');
                tokens[token] = tokens[token].replace(/ue/, 'ü');
                tokens[token] = tokens[token].replace(/oe/, 'ö');
                tokens[token] = tokens[token].replace(/ae/, 'ä');
                if (tokens[token] !== word) {
                    tokens[token] = tokens[token].replace(/ß/, 'ss');
                    let new_token = tokens[token].replace(/a|e|i|o|u|ö|ü|ä/, '');
                    let new_word = word.replace(/a|e|i|o|u|ö|ü|ä/, '');
                    if (new_token === new_word) {
                        tokens[token] = word;
                    }
                }
            }
        }
    }
    return (tokens);
}

const process_spanish = (tokens) => {
    const dictionary = Spanish;
    for (let token in tokens) {
        for (let word in dictionary) {
            if (tokens[token].search(word) === 0 && tokens[token] !== word) {
                tokens[token] = tokens[token].replace(/ado$|ido$|iendo$|éis$|emos$|amos$|áis$|é$|í$|ió$|ó$|iste$|imos$|isteis$|ieron$|ía$|ías$|íamos$|íais$|ían$|ería$|erías$|eríamos$|eríais$|erían$|eré$|eréis$|erás$|erá$|erán$|eremos$|iera$|ieras$|iéramos$|ierais$|ieran$|iese$|ieses$|iésemos$|ieseis$|iesen$|iere$|ieres$|iéremos|iereis$|ieren$|amos$|asteis$|aron$|aba$|abas$|aste$|ábamos$|abais$|aban$|aría$|arías$|aríamos$|aríais$|arían$|aré$|aréis$|arás$|ará$|arán$|aremos$|ara$|aras$|áramos$|arais$|aran$|ase$|ases$|ásemos$|aseis$|asen$|are$|ares$|áremos|areis$|aren$|o$|as$|a$|an$|e$|es$|en$|ad$|ed$|me$|te$|se$|nos$|os$/, '');
                let saved = tokens[token];
                if (tokens[token] !== word) {
                    tokens[token] = tokens[token].split("").reverse().join("");
                    tokens[token] = tokens[token].replace(/o/, 'ue'),
                    tokens[token] = tokens[token].replace(/e/, 'ie');
                    tokens[token] = tokens[token].split("").reverse().join("");
                    if (tokens[token] !== word) {
                        tokens[token] = tokens[token].split("").reverse().join("");
                        tokens[token] = saved.replace(/e/, 'i');
                        tokens[token] = tokens[token].split("").reverse().join("");
                    }
                }
            }
        }
    }
    return (tokens);
}

module.exports.sentiment = sentiment