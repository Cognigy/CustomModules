let https = require('https');
const request = require('request');
const uuidv4 = require('uuid/v4');

/**
 * Finds spelling mistakes and predicts the correct word.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to check
 * @arg {Select[ar,zh-CN,zh-HK,zh-TW,da,nl-BE,nl-NL,en-AU,en-CA,en-IN,en-ID,en-MY,en-NZ,en-PH,en-ZA,en-GB,en-US,fi,fr-BE,fr-CA,fr-FR,fr-CH,de-AT,de-DE,de-CH,it,ja,ko,no,pl,pt-BR,pt-PT,ru,es-AR,es-CL,es-MX,es-ES,es-US,sv,tr]} `language` The texts language
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function spellCheck(input: IFlowInput, args: { secret: CognigySecret, text: string, language: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        const host = 'api.cognitive.microsoft.com';
        const path = '/bing/v7.0/spellcheck';
        const query_string = "?mkt=" + args.language + "&mode=proof";

        const request_params = {
            method: 'POST',
            hostname: host,
            path: path + query_string,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': args.text.length + 5,
                'Ocp-Apim-Subscription-Key': args.secret.key,
            }
        };

        const response_handler = (response) => {
            let body = '';
            response.on('data', (d) => {
                body += d;
            });
            response.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                }
            });
            response.on('error', (err) => {
                if (args.stopOnError) { reject(err.message); return; }
                result = { "error": err.message };
                input.context.getFullContext()[args.store] = result;
                resolve(input);
            });
        };

        const req = https.request(request_params, response_handler);
        req.write("text=" + args.text);
        req.end();
    });
}

module.exports.spellCheck = spellCheck;


/**
 * Recognize the language of the given sentence.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function recognizeLanguage(input: IFlowInput, args: { secret: CognigySecret, text: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key || !args.secret.region) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        const uri = args.secret.region + '.api.cognitive.microsoft.com';
        const path = '/text/analytics/v2.0/languages';

        const response_handler = (response) => {
            let body = '';
            response.on('data', (d) => {
                body += d;
            });
            response.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                }
            });
            response.on('error', (err) => {
                if (args.stopOnError) { reject(err.message); return; }
                result = { "error": err.message };
                input.context.getFullContext()[args.store] = result;
                resolve(input);
            });
        };

        const get_language = (documents) => {
            let body = JSON.stringify(documents);

            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };

        let documents = {
            'documents': [
                { 'id': '1', 'text': args.text }
            ]
        };

        get_language(documents);

    });
}

module.exports.recognizeLanguage = recognizeLanguage;


/**
 * Extracts keyphrases from a given sentence.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[en,es,de]} `language` The texts language
 * @arg {CognigyScript} `text` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function extractKeyphrases(input: IFlowInput, args: { secret: CognigySecret, language: string, text: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key || !args.secret.region) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        const uri = args.secret.region + '.api.cognitive.microsoft.com';
        const path = '/text/analytics/v2.0/keyPhrases';

        const response_handler = (response) => {
            let body = '';
            response.on('data', (d) => {
                body += d;
            });
            response.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                }
            });
            response.on('error', (err) => {
                if (args.stopOnError) { reject(err.message); return; }
                result = { "error": err.message };
                input.context.getFullContext()[args.store] = result;
                resolve(input);
            });
        };

        const get_key_phrases = (documents) => {
            let body = JSON.stringify(documents);

            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };

        let documents = {
            'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ]
        };

        get_key_phrases(documents);

    });
}

module.exports.extractKeyphrases = extractKeyphrases;


/**
 * Finds entities in a given sentence.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[en,es,de]} `language` The texts language
 * @arg {CognigyScript} `text` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function namedEntityRecognition(input: IFlowInput, args: { secret: CognigySecret, language: string, text: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key || !args.secret.region) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        const uri = args.secret.region + '.api.cognitive.microsoft.com';
        const path = '/text/analytics/v2.1-preview/entities';

        const response_handler = (response) => {
            let body = '';
            response.on('data', (d) => {
                body += d;
            });
            response.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.context.getFullContext()[args.store] = result;
                    resolve(input);
                }
            });
            response.on('error', (err) => {
                if (args.stopOnError) { reject(err.message); return; }
                result = { "error": err.message };
                input.context.getFullContext()[args.store] = result;
                resolve(input);
            });
        };

        const get_entities = (documents) => {
            let body = JSON.stringify(documents);

            let request_params = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(request_params, response_handler);
            req.write(body);
            req.end();
        };

        let documents = {
            'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ]
        };

        get_entities(documents);

    });
}

module.exports.namedEntityRecognition = namedEntityRecognition;


/**
 * Searches in the bing web search engine. The entire result is stored in the CognigyInput.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function bingWebSearch(input: IFlowInput, args: { secret: CognigySecret, query: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
    if (!args.query) return Promise.reject("No query defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path: '/bing/v7.0/search?q=' + encodeURIComponent(args.query),
            headers: { 'Ocp-Apim-Subscription-Key': accessKey },
        }, res => {
            let body = '';
            res.on('data', part => body += part);
            res.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.input[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.input[args.store] = result;
                    resolve(input);
                }

            });
            res.on('error', err => {
                if (args.stopOnError) { reject(err.message); return; }
                result = { "error": err.message };
                input.input[args.store] = result;
                resolve(input);
            })
        })
    });
}

module.exports.bingWebSearch = bingWebSearch;


/**
 * Searches in the bing news search engine. The entire result is stored in the CognigyInput.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `term` The text to search in the news
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function bingNewsSearch(input: IFlowInput, args: { secret: CognigySecret, term: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
    if (!args.term) return Promise.reject("No news term defined.");

    return new Promise((resolve, reject) => {
        let result = {};

        let accessKey = args.secret.key;

        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path: '/bing/v7.0/news/search?q=' + encodeURIComponent(args.term),
            headers: { 'Ocp-Apim-Subscription-Key': accessKey },
        }, res => {
            let body = '';
            res.on('data', (d) => {
                body += d;
            });
            res.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.input[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.input[args.store] = result;
                    resolve(input);
                }

            });
        })
    });
}

module.exports.bingNewsSearch = bingNewsSearch;


/**
 * Searches in the bing image search engine. The entire result is stored in the CognigyInput.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `term` The text to search in the news
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function bingImageSearch(input: IFlowInput, args: { secret: CognigySecret, term: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
    if (!args.term) return Promise.reject("No image term defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        const request_params = {
            method: 'GET',
            hostname: 'api.cognitive.microsoft.com',
            path: '/bing/v7.0/images/search' + '?q=' + encodeURIComponent(args.term),
            headers: {
                'Ocp-Apim-Subscription-Key': accessKey,
            }
        };

        const response_handler = (response) => {
            let body = '';

            response.on('data', (d) => {
                body += d;
            });

            response.on('end', () => {
                try {
                    result = JSON.parse(body);
                    input.input[args.store] = result;
                    resolve(input);
                } catch (e) {
                    if (args.stopOnError) { reject(e.message); return; }
                    result = { "error": e.message };
                    input.input[args.store] = result;
                    resolve(input);
                }
            });
        };

        const req = https.request(request_params, response_handler);
        req.end();
    });
}

module.exports.bingImageSearch = bingImageSearch;


/**
 * Translates a given text in a chosen language.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[af,ar,bn,bs,bg,yue,ca,zh-Hans,zh-Hant,hr,cs,da,nl,en,et,fj,fil,fi,fr,de,el,ht,he,hi,mww,hu,is,id,it,ja,sw,tlh,tlh-Qaak,ko,lv,lt,mg,ms,mt,nb,fa,pl,pt,otq,ro,ru,sm,sr-Cyrl,sr-Latn,sk,sl,es,sv,ty,ta,te,th,to,tr,uk,ur,vi,cy,yau]} `language` to which language it should translate
 * @arg {CognigyScript} `text` The text to check
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function textTranslator(input: IFlowInput, args: { secret: CognigySecret, language: string, text: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        let accessKey = args.secret.key;

        const options = {
            method: 'POST',
            baseUrl: 'https://api.cognitive.microsofttranslator.com/',
            url: 'translate',
            qs: {
                'api-version': '3.0',
                'to': args.language
            },
            headers: {
                'Ocp-Apim-Subscription-Key': accessKey,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            body: [{
                'text': args.text
            }],
            json: true,
        };

        request(options, (err, res, body) => {
            try {
                result = body;
                input.context.getFullContext()[args.store] = result;
                resolve(input);
            } catch (e) {
                if (args.stopOnError) { reject(e.message); return; }
                result = { "error": e.message };
                input.input[args.store] = result;
                resolve(input);
            }

        });
    });
}

module.exports.textTranslator = textTranslator;