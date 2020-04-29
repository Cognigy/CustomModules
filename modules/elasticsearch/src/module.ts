import * as elasticsearch from 'elasticsearch';

/**
 * Simple elastic search.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The search query
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function searchSimple(input: IFlowInput, args: { secret: CognigySecret, query: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}>  {

    const { secret, query, contextStore, stopOnError } = args;
    const { host } = secret;

    if (!secret) throw new Error('No secret defined');
    if (!host) throw new Error("The secret is missing the 'host' field");
    if (!query) throw new Error("No search query defined");
    if (!contextStore) throw new Error("No context store defined");


    const client = await new elasticsearch.Client({
        host,
        log: 'trace'
    });

    try {
        const body = await client.search({q: query});

        input.actions.addToContext(contextStore, body, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        }
        input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }

    return input;
}

module.exports.searchSimple = searchSimple;


/**
 * Elastic search with DSL body.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `index` The search index in elastic search
 * @arg {CognigyScript} `type` The type in the index in elastic search
 * @arg {JSON} `body` The query body containing elastic search DSL
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function searchWithDSL(input: IFlowInput, args: { secret: CognigySecret, index: string, type: string, body: JSON, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}>  {

    const { secret, index, type, body, contextStore, stopOnError } = args;
    const { host } = secret;

    if (!secret) throw new Error('No secret defined');
    if (!host) throw new Error("The secret is missing the 'host' field");
    if (!index) throw new Error("No elastic search index defined");
    if (!type) throw new Error("No elastic search index type defined");
    if (!body) throw new Error("No DSL query body defined");
    if (!contextStore) throw new Error("No context store defined");


    const client = await new elasticsearch.Client({
        host,
        log: 'trace'
    });

    try {
        // prevent 404
        await client.indices.delete({
            index,
            ignore: [404]
          });

        const response = await client.search({
            index,
            type,
            body
        });

        input.actions.addToContext(contextStore, response, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        }
        input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }

    return input;
}

module.exports.searchWithDSL = searchWithDSL;

