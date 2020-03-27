import * as request_promise from 'request-promise';

function _handleError(input: IFlowInput, error: Error, stopOnError: boolean, writeToContext: boolean, store: string): IFlowInput | {} {

    input.actions.log("error", error.message);

    if (writeToContext) {
        input.context.getFullContext()[store] = { "error": error };
    } else {
        input.input[store] = { "error": error };
    }

    if (stopOnError) {
        return Promise.reject(error.message);
    } else {
        return input;
    }

}

/**
 * Get current geolocation by free text.
 *
 * @arg {SecretSelect} `secret` Secret with app_id and app_code
 * @arg {String} `searchtext` Query to turn into a geolocation
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 *
 */
async function geocoderGeocode(input: IFlowInput, args: { secret: CognigySecret, searchtext: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    try {

        if (!args.secret || !args.secret.app_id || !args.secret.app_code) return Promise.reject("Secret not defined or invalid.");
        if (!args.searchtext) return Promise.reject("Searchtext not defined or invalid.");

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `https://geocoder.api.here.com/6.2/geocode.json`,
            qs: {
                app_id: args.secret.app_id,
                app_code: args.secret.app_code,
                searchtext: args.searchtext
            },
            json: true
        };

        // Handle request
        const result = await request_promise.get(options);
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;

    } catch (error) {
        return _handleError(input, error.error ? error.error : error, args.stopOnError, args.writeToContext, args.store);
    }
}

module.exports.geocoderGeocode = geocoderGeocode;

/**
 * Get places by free text via discovery search at geolocation.
 *
 * @arg {SecretSelect} `secret` Secret with app_id and app_code
 * @arg {Number} `latitude` Latitude of the geolocation
 * @arg {Number} `longitude` Longitude of the geolocation
 * @arg {String} `searchtext` Query to turn into a geolocation
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 *
 */
async function placesDiscoverSearch(input: IFlowInput, args: { secret: CognigySecret, latitude: number, longitude: number, searchtext: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    try {

        if (!args.secret || !args.secret.app_id || !args.secret.app_code) return Promise.reject("Secret not defined or invalid.");
        if (!args.latitude || !args.longitude) return Promise.reject("Location (latitude/longitude) not defined or invalid.");
        if (!args.searchtext) return Promise.reject("Searchtext not defined or invalid.");

        // Update these options with the details of the web service you would like to call
        const options: request_promise.OptionsWithUri = {
            uri: `https://places.api.here.com/places/v1/discover/search`,
            qs: {
                app_id: args.secret.app_id,
                app_code: args.secret.app_code,
                at: args.latitude + "," + args.longitude,
                q: args.searchtext
            },
            json: true
        };

        // Handle request
        const result = await request_promise.get(options);
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;

    } catch (error) {
        return _handleError(input, error.error ? error.error : error, args.stopOnError, args.writeToContext, args.store);
    }
}

module.exports.placesDiscoverSearch = placesDiscoverSearch;

/**
 * Get places by free text via discovery search at geolocation.
 *
 * @arg {SecretSelect} `secret` Secret with app_id and app_code
 * @arg {Number} `latitude` Latitude of the geolocation
 * @arg {Number} `longitude` Longitude of the geolocation
 * @arg {Number} `zoom` Zoom level for the image
 * @arg {Number} `width` Width for the image
 * @arg {Number} `height` Height for the image
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 *
 */
async function mapsImageMapview(input: IFlowInput, args: { secret: CognigySecret, latitude: number, longitude: number, zoom: number, width: number, height: number, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    try {

        if (!args.secret || !args.secret.app_id || !args.secret.app_code) return Promise.reject("Secret not defined or invalid.");
        if (!args.latitude || !args.longitude) return Promise.reject("Location (latitude/longitude) not defined or invalid.");
        if (!args.zoom) return Promise.reject("Zoom-level not defined or invalid.");
        if (!args.width || !args.height) return Promise.reject("Image-dimensions (width/height) not defined or invalid.");

        // Create image URL
        const imageURL = `https://image.maps.api.here.com/mia/1.6/mapview?c=${args.latitude},${args.longitude}&z=${args.zoom}&w=${args.width}&h=${args.height}&app_id=${args.secret.app_id}&app_code=${args.secret.app_code}`;

        if (args.writeToContext) input.context.getFullContext()[args.store] = imageURL;
        else input.input[args.store] = imageURL;
        return input;

    } catch (error) {
        return _handleError(input, error, args.stopOnError, args.writeToContext, args.store);
    }
}

module.exports.mapsImageMapview = mapsImageMapview;


