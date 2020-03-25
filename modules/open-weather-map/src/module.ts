const weather = require('openweather-apis');

/**
 * Get the entire weather information of a chosen city.
 * @arg {SecretSelect} `secret` The provided secret
 * @arg {CognigyScript} `city` The city you want to know the weather from
 * @arg {Select[en,ru,input,es,uk,de,pt,ro,pl,fi,nl,fr,bg,sv,zh_tw,zh,tr,hr,ca]} `language` The weather language
 * @arg {Select[metric,internal,imperial]} `units` The weather unit
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getAllWeather(input: any, args: { secret: any, city: string, language: string, units: string, contextStore: string, stopOnError: boolean }): Promise<any | {}> {
    // Check parameters
    const { secret, city, language, units, contextStore, stopOnError } = validateArgs(args);
    const { api_key } = secret;

    try {
        weather.setLang(language);

        // set city by name
        weather.setCity(city);

        // 'metric'  'internal'  'imperial'
        weather.setUnits(units);

        // check http://openweathermap.org/appid#get for get the APPID
        weather.setAPPID(api_key);

        // get all the JSON file returned from server (rich of info)

        await new Promise((resolve, reject) => {
            weather.getAllWeather((err, JSONObj) => {
                if (err) {
                    if (stopOnError) {
                        reject(err.message);
                    } else {
                        input.actions.addToContext(contextStore, { error: err.message }, 'simple');
                    }
                }

                input.actions.addToContext(contextStore, JSONObj, 'simple');
                resolve();
            });
        });
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.getAllWeather = getAllWeather;


/**
 * Get the temperature only for a chosen city.
 * @arg {SecretSelect} `secret` The provided secret
 * @arg {CognigyScript} `city` The city you want to know the weather from
 * @arg {Select[en,ru,input,es,uk,de,pt,ro,pl,fi,nl,fr,bg,sv,zh_tw,zh,tr,hr,ca]} `language` The weather language
 * @arg {Select[metric,internal,imperial]} `units` The weather unit
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getTemperature(input: any, args: { secret: any, city: string, language: string, units: string, contextStore: string, stopOnError: boolean }): Promise<any | {}> {
    // Check parameters
    const { secret, city, language, units, contextStore, stopOnError } = validateArgs(args);
    const { api_key } = secret;

    try {
        weather.setLang(language);

        // set city by name
        weather.setCity(city);

        // 'metric'  'internal'  'imperial'
        weather.setUnits(units);

        // check http://openweathermap.org/appid#get for get the APPID
        weather.setAPPID(api_key);

        // get all the JSON file returned from server (rich of info)

        await new Promise((resolve, reject) => {
            weather.getTemperature((err, temp) => {
                if (err) {
                    if (stopOnError) {
                        reject(err.message);
                    } else {
                        input.actions.addToContext(contextStore, { error: err.message }, 'simple');
                    }
                }

                input.actions.addToContext(contextStore, temp, 'simple');
                resolve();
            });
        });
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.getTemperature = getTemperature;


interface IValidateArgsResponse {
    secret: {
        api_key: string
    };
    city: string;
    language: string;
    units: string;
    contextStore: string;
    stopOnError: boolean;
}

function validateArgs(args: {secret: CognigySecret, city: string, language: string, units: string, contextStore: string, stopOnError: boolean}): IValidateArgsResponse {

    const { secret, city, language, units, contextStore, stopOnError } = args;
    const { api_key } = secret;

    if (!secret) throw new Error("No secret defined");
    if (!api_key) throw new Error("The secret is missing the 'api_key' field.");
    if (!language) throw new Error("No language is defined.");
    if (!city) throw new Error("No city is defined.");
    if (!units) throw new Error("No units defined.");
    if (!contextStore) throw new Error("No context store key defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    return {
        secret: {api_key}, city, language, units, contextStore, stopOnError
    };
}