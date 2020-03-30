const NewsAPI = require('newsapi');

/**
 * Get the user details.
 * @arg {SecretSelect} `secret` The provided secret
 * @arg {Select[ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,cz,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,it,jp,kr,lt,lv,ma,mx,my,ng,nl,no,nz,ph,pl,pt,ro,rs,ru,sa,se,sg,si,sk,th,tr,tw,ua,us,ve,za]} `country` The news country
 * @arg {Select[en,de]} `language` The language of the news
 * @arg {Select[bbc-news,the-verge,cbs-news,abc-news,bild,cnn,der-tagesspiegel,focus,fox-news,t3n,marca,the-telegraph,wired,the-wall-street-journal,spiegel-online,the-washington-times,the-new-york-times,die-zeit,la-repubblica,nhl-news,espn]} `sources` The news magazine
 * @arg {Select[general,business,technology,entertainment,health,science,sports]} `category` The news magazine
 * @arg {CognigyScript} `query` The search query
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getNewsHeadlines(input: IFlowInput, args: { secret: CognigySecret, country: string, language: string, sources: string, category: string, query: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // Check parameters
    const { secret, country, sources, language, category, query, contextStore, stopOnError } = args;
    const { apiKey } = secret;
    if (!secret) return Promise.reject("No secret defined");
    if (!apiKey) return Promise.reject("The secret is missing the 'apiKey' field.");
    if (!contextStore) return Promise.reject("No context store key defined.");
    if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

    const newsapi = new NewsAPI(apiKey);

    try {
        const response = await newsapi.v2.topHeadlines({
            sources,
            q: query,
            category,
            language,
            country
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

module.exports.getNewsHeadlines = getNewsHeadlines;