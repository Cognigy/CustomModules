const spauth = require('node-sp-auth');
const request = require('request-promise');

/**
 * Get entire information of sharepoint site
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `url` The API request url
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getSharepointSiteInfo(input, args) {

  /* validate node arguments */
  const { secret, url, contextStore, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!url) throw new Error("The request url is not defined.");
  if (!contextStore) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username, password } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");

  try {

    const data = await spauth.getAuth(url, {
      username,
      password
    });

    let headers = data.headers;
    headers['Accept'] = 'application/json;odata=verbose';

    const response = await request.get({
      url: `${url}/_api/web`,
      headers: headers,
      json: true
    });

    input.actions.addToContext(contextStore, response, 'simple');
  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }

  return input;
}

module.exports.getSharepointSiteInfo = getSharepointSiteInfo;


/**
 * Get entire information of sharepoint site
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `url` The API request url
 * @arg {CognigyScript} `list` The sharepoint list
 * @arg {CognigyScript} `filter` You can add a filter, e.g. '?$select=Title'
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getSharepointListItems(input, args) {

  /* validate node arguments */
  const { secret, url, list, filter, contextStore, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (!url) throw new Error("The request url is not defined.");
  if (!list) throw new Error("The sharepoint list is not defined.");
  if (!contextStore) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  if (filter.length !== 0) {
    if (!filter.includes('?')) {
      throw new Error("You have to insert an '?' at the beginning of your filter.")
    }
  }

  /* validate secrets */
  const { username, password } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.");
  if (!password) throw new Error("Secret is missing the 'password' field.");

  try {

    const data = await spauth.getAuth(url, {
      username,
      password
    });

    let headers = data.headers;
    headers['Accept'] = 'application/json;odata=verbose';

    const response = await request.get({
      url: `${url}/_api/lists/getbytitle('${list}')/items/${filter}`,
      headers: headers,
      json: true
    });

    input.actions.addToContext(contextStore, response, 'simple');
  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }

  return input;
}

module.exports.getSharepointListItems = getSharepointListItems;