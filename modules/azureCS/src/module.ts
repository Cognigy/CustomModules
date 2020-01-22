const https = require('https');
const request = require('request');
const uuidv4 = require('uuid/v4');
import axios from 'axios';

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
        const queryString = `?mkt=${args.language}&mode=proof`;

        const requestParams = {
            method: 'POST',
            hostname: host,
            path: path + queryString,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': args.text.length + 5,
                'Ocp-Apim-Subscription-Key': args.secret.key,
            }
        };

        const responseHandler = (response) => {
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

        const req = https.request(requestParams, responseHandler);
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
        const accessKey = args.secret.key;

        const uri = `${args.secret.region}.api.cognitive.microsoft.com`;
        const path = '/text/analytics/v2.0/languages';

        const responseHandler = (response) => {
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

        const getLanguage = (documents) => {
            const body = JSON.stringify(documents);

            const requestParams = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(requestParams, responseHandler);
            req.write(body);
            req.end();
        };

        const documents = {
            'documents': [
                { 'id': '1', 'text': args.text }
            ]
        };

        getLanguage(documents);

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
        const accessKey = args.secret.key;

        const uri = `${args.secret.region}.api.cognitive.microsoft.com`;
        const path = '/text/analytics/v2.0/keyPhrases';

        const responseHandler = (response) => {
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

        const getKeyPhrases = (documents) => {
            const body = JSON.stringify(documents);

            const requestParams = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(requestParams, responseHandler);
            req.write(body);
            req.end();
        };

        const documents = {
            'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ]
        };

        getKeyPhrases(documents);

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
        const accessKey = args.secret.key;

        const uri = `${args.secret.region}.api.cognitive.microsoft.com`;
        const path = '/text/analytics/v2.1-preview/entities';

        const responseHandler = (response) => {
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

        const getEntities = (documents) => {
            const body = JSON.stringify(documents);

            const requestParams = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(requestParams, responseHandler);
            req.write(body);
            req.end();
        };

        const documents = {
            'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text }
            ]
        };

        getEntities(documents);

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
        const accessKey = args.secret.key;

        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path: `/bing/v7.0/search?q=${encodeURIComponent(args.query)}`,
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
            });
        });
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

        const accessKey = args.secret.key;

        https.get({
            hostname: 'api.cognitive.microsoft.com',
            path: `/bing/v7.0/news/search?q=${encodeURIComponent(args.term)}`,
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
        });
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
        const accessKey = args.secret.key;

        const requestParams = {
            method: 'GET',
            hostname: 'api.cognitive.microsoft.com',
            path: `/bing/v7.0/images/search?q=${encodeURIComponent(args.term)}`,
            headers: {
                'Ocp-Apim-Subscription-Key': accessKey,
            }
        };

        const responseHandler = (response) => {
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

        const req = https.request(requestParams, responseHandler);
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
        const accessKey = args.secret.key;

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


/**
 * Returns the sentiment of a given sentence.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text to analyse
 * @arg {Select[af,ar,bn,bs,bg,yue,ca,zh-Hans,zh-Hant,hr,cs,da,nl,en,et,fj,fil,fi,fr,de,el,ht,he,hi,mww,hu,is,id,it,ja,sw,tlh,tlh-Qaak,ko,lv,lt,mg,ms,mt,nb,fa,pl,pt,otq,ro,ru,sm,sr-Cyrl,sr-Latn,sk,sl,es,sv,ty,ta,te,th,to,tr,uk,ur,vi,cy,yau]} `language` the language of the given text
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function analyseSentiments(input: IFlowInput, args: { secret: CognigySecret, text: string, language: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.key || !args.secret.region) return Promise.reject("Secret not defined or invalid.");
    if (!args.text) return Promise.reject("No text defined.");
    if (!args.language) return Promise.reject("No language defined.");

    return new Promise((resolve, reject) => {
        let result = {};
        const accessKey = args.secret.key;

        const uri = `${args.secret.region}.api.cognitive.microsoft.com`;
        const path = '/text/analytics/v2.0/sentiment';

        const responseHandler = (response) => {
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

        const getSentiments = (documents) => {
            const body = JSON.stringify(documents);

            const requestParams = {
                method: 'POST',
                hostname: uri,
                path: path,
                headers: {
                    'Ocp-Apim-Subscription-Key': accessKey,
                }
            };

            const req = https.request(requestParams, responseHandler);
            req.write(body);
            req.end();
        };

        const documents = {
            'documents': [
                { 'id': '1', 'language': args.language, 'text': args.text },
            ]
        };

        getSentiments(documents);
    });
}

module.exports.analyseSentiments = analyseSentiments;


/**
 * Authenticates the user via Microsoft login
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `redirectUri` The url which should be triggered after user is logged in with microsoft
 * @arg {CognigyScript} `scope` For example user.read
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function startAuthenticationWithADAL(input: IFlowInput, args: { secret: CognigySecret, redirectUri: string, scope: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, redirectUri, scope, contextStore, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!redirectUri) throw new Error("The URI to redirect is not defined.");
    if (!scope) throw new Error("Scope is not defined.");
    if (!contextStore) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { clientId, clientSecret } = secret;
    if (!clientId) throw new Error("Secret is missing the 'clientId' field.");
    if (!clientSecret) throw new Error("Secret is missing the 'clientSecret' field.");

    /* trigger the microsoft login webchat plugin */
    input.actions.output('', {
        _plugin: {
            type: 'microsoft-auth',
            clientId,
            redirectUri,
            scope
        }
    });

    return input;
}

module.exports.startAuthenticationWithADAL = startAuthenticationWithADAL;

/**
 * Gets the authentication acces token from Microsoft
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `redirectUri` The url which should be triggered after user is logged in with microsoft
 * @arg {CognigyScript} `scope` For example user.read
 * @arg {CognigyScript} `authCode` The microsoft auth code, your call back url stored
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getAuthenticationTokenWithADAL(input: IFlowInput, args: { secret: CognigySecret, redirectUri: string, scope: string, authCode: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, redirectUri, scope, authCode, contextStore, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!redirectUri) throw new Error("The URI to redirect is not defined.");
    if (!scope) throw new Error("Scope is not defined.");
    if (!authCode) throw new Error("Microsoft authentication code from callback URI is not defined.");
    if (!contextStore) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { clientId, clientSecret } = secret;
    if (!clientId) throw new Error("Secret is missing the 'clientId' field.");
    if (!clientSecret) throw new Error("Secret is missing the 'clientSecret' field.");

    const tokenPayload = `client_id=${clientId}`
        + `&grant_type=authorization_code`
        + `&scope=${scope}`
        + `&code=${authCode}`
        + `&redirect_uri=${encodeURIComponent(redirectUri)}`
        + `&client_secret=${clientSecret}`;

    try {
        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', tokenPayload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        input.actions.addToContext(contextStore, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.getAuthenticationTokenWithADAL = getAuthenticationTokenWithADAL;