import axios from 'axios';


/**
 * Get the nearest result for the search term at the user location.
 * @arg {SecretSelect} `secret` Google Geolocation API Secret
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getUserLocation(input: any, args: { secret: CognigySecret, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // check the input arguments
    let { secret, contextStore, stopOnError } = args;

    if (!secret) throw new Error('No file id defined.');
    if (!contextStore) throw new Error('No context store defined.');

    const { key } = secret;

    if (!key) throw new Error("The secret is missing the 'key' value. You need to insert your Google API key with Geolocation API enabled.");


    try {

        // get the current user message data object
        const { data } = input;
        const { request } = data;
        const { message } = request;
        const { attachments } = message;


        // get the user location payload url
        let userLocation = {};
        let address = "";

        if (attachments[0].type === 'location') {
            const locationUrlStringified = attachments[0].payload.url;
            const locationUrl = decodeURI(locationUrlStringified);

            // extract the longitude and latitude information
            let locationResult = locationUrl.match(/[1-9]+\.[1-9]+/g);
            userLocation = {
                latitude: locationResult[0],
                longitude: locationResult[1]
            };

            // check if two values were found in the url (long, lat)
            if (locationResult.length === 2) {
                // do something
            }
        } else {
            throw new Error('No location defined');
        }

        // get the google maps location of the search term based on the user location
        const place = await axios({
            url: `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&latlng=${userLocation["latitude"]},${userLocation["longitude"]}`,
            method: 'GET'
        });
        try {
            address = place.data.results[0].formatted_address;
        } catch (error) {
            // location not found
            throw new Error('New Google Maps location found based on the location and search term.');
        }

        input.actions.addToContext(contextStore, {
            user: userLocation,
            address
        }, 'simple');

    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}
module.exports.getUserLocation = getUserLocation;
