const axios = require('axios');
const uuidv4 = require('uuid/v4')

/**
 * Gets the information of a chosen table
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[Locations,Events,Products,Assets,Entities,Folders,Menus,Bios]} `entity` The entity you want to get from Yext
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, entity, api_version, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!entity) throw new Error("Entity not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { api_key } = secret;
    if (!api_key) throw new Error("Secret is missing the 'api_key' field.");

    const version = api_version || "20190424"

    try {
        const response = await axios.get(`https://api.yext.com/v2/accounts/me/${entity.toLowerCase()}`, {
            headers: {
                'Allow': 'application/json'
            },
            params: {
                api_key,
                v: version
            }
        });

        input.actions.addToContext(store, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GetEntity = GetEntity;


/**
 * Gets the information of a specific entity
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[Locations,Events,Products,Assets,Entities,Folders,Menus,Bios]} `entity` The entity you want to get from Yext
 * @arg {CognigyScript} `entity_id` The entitie's id you want to get from Yext
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetEntityById(input: IFlowInput, args: { secret: CognigySecret, entity: string, entity_id: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, entity, entity_id, api_version, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!entity) throw new Error("Entity not defined.");
    if (!entity_id) throw new Error("Entity Id not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { api_key } = secret;
    if (!api_key) throw new Error("Secret is missing the 'api_key' field.");

    let version = api_version || "20190424"

    try {
        const response = await axios.get(`https://api.yext.com/v2/accounts/me/${entity.toLowerCase()}/${entity_id}`, {
            headers: {
                'Allow': 'application/json'
            },
            params: {
                api_key,
                v: version
            }
        });

        input.actions.addToContext(store, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GetEntityById = GetEntityById;


/**
 * Gets the information of filtered locations
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `filters` The filters to use for this search
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function GetLocationsByFilter(input: IFlowInput, args: { secret: CognigySecret, filters?: string, api_version?: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, filters, api_version, store, stopOnError } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { api_key } = secret;
    if (!api_key) throw new Error("Secret is missing the 'api_key' field.");

    const version = api_version || "20190424"

    try {
        const response = await axios.get(`https://api.yext.com/v2/accounts/me/locationsearch`, {
            headers: {
                'Allow': 'application/json'
            },
            params: {
                filters: JSON.stringify(filters),
                api_key,
                v: version
            }
        });

        input.actions.addToContext(store, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message)
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.GetLocationsByFilter = GetLocationsByFilter;

/**
 * Creates a new location entity in Yext
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `locationName` The name of the new location
 * @arg {CognigyScript} `address` The address of the new location
 * @arg {CognigyScript} `city` The city of the new location
 * @arg {CognigyScript} `state` The state of the new location
 * @arg {CognigyScript} `zip` The zip code of the new location
 * @arg {CognigyScript} `countryCode` The country code of the new location
 * @arg {CognigyScript} `phone` The phone of the new location
 * @arg {CognigyScriptArray} `categoryIds` The categoryIds for the new location
 * @arg {CognigyScript} `featuredMessage` The featuredMessage of the new location
 * @arg {CognigyScript} `api_version` The version you want to use, e.g. 20190424 (a date)
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 * @arg {CognigyScript} `store` Where to store the result
 */
async function CreateLocation(input: IFlowInput, args: { secret: CognigySecret, locationName: string, address: string, city: string, state: string, zip: string, countryCode: string, phone: string, categoryIds: string[], featuredMessage: string, api_version: string, stopOnError: boolean, store: string }): Promise<IFlowInput | {}> {

    /* validate node arguments */
    const { secret, locationName, address, city, state, zip, countryCode, phone, categoryIds, featuredMessage, api_version, stopOnError, store } = args;
    if (!secret) throw new Error("Secret not defined.");
    if (!locationName) throw new Error("Location name not defined.");
    if (!address) throw new Error("Address not defined.");
    if (!city) throw new Error("City not defined.");
    if (!state) throw new Error("State not defined.");
    if (!zip) throw new Error("Zip not defined.");
    if (!countryCode) throw new Error("Country code not defined.");
    if (countryCode.length !== 2) throw new Error("Country code has to look like 'de', 'en', 'es', and so on.");
    if (!phone) throw new Error("Phone number not defined.");
    if (!categoryIds) throw new Error("CategoryIds not defined.");
    if (!featuredMessage) throw new Error("Featured message not defined.");
    if (!store) throw new Error("Context store not defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    /* validate secrets */
    const { api_key } = secret;
    if (!api_key) throw new Error("Secret is missing the 'api_key' field.");

    const version = api_version || "20190424"
    const id = uuidv4()
    const data = {
        id,
        locationName,
        address,
        city,
        state,
        zip,
        countryCode: countryCode.toLocaleLowerCase(),
        phone,
        categoryIds,
        featuredMessage
    }

    try {
        const response = await axios.post(`https://api.yext.com/v2/accounts/me/locations`, data, {
            headers: {
                'Allow': 'application/json'
            },
            params: {
                api_key,
                v: version
            }
        });

        input.actions.addToContext(store, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message)
        } else {
            input.actions.addToContext(store, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.CreateLocation = CreateLocation;