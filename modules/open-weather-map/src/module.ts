const weather = require('openweather-apis');

/**
 * Get the user details.
 * @arg {SecretSelect} `secret` The provided secret
 * @arg {CognigyScript} `city` The city you want to know the weather from
 * @arg {Select[en,ru,input,es,uk,de,pt,ro,pl,fi,nl,fr,bg,sv,zh_tw,zh,tr,hr,ca]} `language` The weather language
 * @arg {Select[metric,internal,imperial]} `units` The weather unit
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getWeather(input: any, args: { secret: any, city: string, language: string, units: string, contextStore: string, stopOnError: boolean }): Promise<any | {}> {
    // Check parameters
    const { secret, city, language, units, contextStore, stopOnError } = args;
    const { api_key } = secret;
    if (!secret) return Promise.reject("No secret defined.");
    if (!api_key) return Promise.reject("The secret is missing the 'api_key' field.");
    if (!language) return Promise.reject("No language is defined.");
    if (!units) return Promise.reject("No units defined.");
    if (!contextStore) return Promise.reject("No context store key defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

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
                        throw new Error(err.message);
                    } else {
                        input.actions.addToContext(contextStore, { error: err.message }, 'simple');
                    }
                }

                input.context.getFullContext()[contextStore] = JSONObj;
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

module.exports.getWeather = getWeather;