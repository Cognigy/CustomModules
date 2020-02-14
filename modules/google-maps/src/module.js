const request = require('request-promise');
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