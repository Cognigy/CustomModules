const English = require('../AFINN_111.json');
const German = require('../polartlexicon.json');
const Spanish = require('../SentiCon.json');
const Forms_de = require('../de_stems.json');

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
            if (tokens[token] === negations[neg]) {
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
        input.actions.addToContext('sentiment', result, 'simple');
        resolve(input);
    });
}

const process_german = (tokens) => {
    const dictionary = German;
    const forms = Forms_de;
    for (let token in tokens) {
        for (let word in dictionary) {
            let old_token = tokens[token];
            if (tokens[token] !== word) {
                tokens[token] = tokens[token].replace(/ge/, '');
                tokens[token] = tokens[token].replace(/ss/g, 'ß');
                tokens[token] = tokens[token].replace(/ue/g, 'ü');
                tokens[token] = tokens[token].replace(/oe/g, 'ö');
                tokens[token] = tokens[token].replace(/ae/g, 'ä'); 
                if (tokens[token] !== word) {
                    tokens[token] = tokens[token].replace(/ü/g, 'u');
                    tokens[token] = tokens[token].replace(/ö/g, 'o');
                    tokens[token] = tokens[token].replace(/ä/g, 'a');
                    for (let stem in forms) {
                        let exp = new RegExp(stem);
                        if (exp.test(tokens[token])===true){
                            tokens[token] = tokens[token].replace(exp, forms[stem]);
                        }
                    }
                    if (tokens[token] !== word) {
                        tokens[token] = tokens[token].replace(/t$|er$|es$|em$|en$|e$/, '');
                        if (tokens[token] !== word) {
                            tokens[token] = tokens[token].replace(/tes$|te$|est$|st$|s$|t$|e$|es$|ere$|er$/, '');
                            if (tokens[token] !== word) {
                                tokens[token] = old_token;
                            }
                        }
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

module.exports.sentiment = sentiment;