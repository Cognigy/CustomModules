import axios from 'axios';

/**
 * Authenticates the user via Microsoft login
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `redirectUri` The url which should be triggered after user is logged in with microsoft
 * @arg {CognigyScript} `scope` For example user.read
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function startAuthentication(input: IFlowInput, args: { secret: CognigySecret, redirectUri: string, scope: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

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

module.exports.startAuthentication = startAuthentication;


/**
 * Authenticates the user via Microsoft login
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `redirectUri` The url which should be triggered after user is logged in with microsoft
 * @arg {CognigyScript} `scope` For example user.read
 * @arg {CognigyScript} `authCode` The microsoft auth code, your call back url stored
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getAuthenticationToken(input: IFlowInput, args: { secret: CognigySecret, redirectUri: string, scope: string, authCode: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

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

module.exports.getAuthenticationToken = getAuthenticationToken;