const request = require('request-promise');
const axios = require('axios');

/**
 * Shows a google map to the user of a Webchat 
 * @arg {SecretSelect} `secret` The configured secret to use API KEY; one Element: api_key
 * @arg {CognigyScript} `searchquery` Centers the map on an address
 * @arg {CognigyScript} `latitude` If no address: the latitute of the start position (e.g. 51.2139586)
 * @arg {CognigyScript} `longitude` If no address: the longitude of the start position (e.g. 6.7489951)
 * @arg {CognigyScript} `zoom` The zoom factor of the map (e.g. 15)
 */
async function showGoogleMaps(cognigy, args) {
    let { secret, searchquery, latitude, longitude, zoom } = args;
    latitude = Number(latitude);
    longitude = Number(longitude);
    zoom = Number(zoom);

    if (isNaN(latitude)) {
        latitude = 51.2141562;
    }
    if (isNaN(longitude)) {
        longitude = 6.7488952;
    }
    if (isNaN(zoom)) {
        zoom = 10;
    }
    if (searchquery) {
        const place = await request({
            uri: 'https://maps.googleapis.com/maps/api/geocode/json',
            qs: {
                key: secret.api_key,
                address: searchquery
            },
            json: true
        });
        try {
            const { lng, lat } = place.results[0].geometry.location;
            longitude = lng;
            latitude = lat;
        } catch (error) {
            //location not found
        }
    }
    cognigy.actions.output('', {
        _plugin: {
            type: 'google-maps',
            center: {
                lat: latitude,
                lng: longitude
            },
            zoom: zoom,
            bootstrapURLKeys: secret.api_key
        }
    });
    return Promise.resolve(cognigy);
}
module.exports.showGoogleMaps = showGoogleMaps;


/**
 * Get the nearest result for the search term at the user location.
 * @arg {SecretSelect} `secret` Google Geolocation API Secret
 * @arg {CognigyScript} `place` The place where the user is, e.g. Cognigy or Burger King
 * @arg {CognigyScript} `city` The city the user is currently in
 * @arg {CognigyScript} `country` The country the user is currently in
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getUserLocationFromTextMessage(cognigy, args) {

    // check the input arguments
    let { secret, place, city, country, contextStore, stopOnError } = args;

    if (!secret) throw new Error('No file id defined.');
    if (!place) throw new Error('No user place defined.');
    if (!city) throw new Error('No user city defined.');
    if (!country) throw new Error('No user country defined.');
    if (!contextStore) throw new Error('No context store defined.');

    const { key } = secret;

    if (!key) throw new Error("The secret is missing the 'key' value. You need to insert your Google API key with Geolocation API enabled.");

    // create google search address from user information
    let address = `${place}, ${city}, ${country}`;

    // initialize variables to fill them later with google location
    let userAddress = "";
    let coordinates = {};

    try {

        // get the google maps location of the search term based on the user location
        const googleResponse = await axios({
            url: `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&address=${address}`,
            method: 'GET'
        });

        try {
            userAddress = googleResponse.data.results[0].formatted_address;
            coordinates = {
                latitude: googleResponse.data.results[0].geometry.location.lat,
                longitude: googleResponse.data.results[0].geometry.location.lng
            };
        } catch (error) {
            // location not found
            throw new Error('New Google Maps location found based on the location and search term.');
        }

        cognigy.actions.addToContext(contextStore, {
            coordinates,
            address: userAddress,
            name: place
        }, 'simple');

    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            cognigy.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return cognigy;
}
module.exports.getUserLocationFromTextMessage = getUserLocationFromTextMessage;
