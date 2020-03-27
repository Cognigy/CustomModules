import * as Fuse from "fuse.js";

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
 * Search items by searchtext and returns a list of found items according to the options.
 * @arg {JSON} `items` Items to search according to https://fusejs.io/
 * @arg {JSON} `options` Options according to https://fusejs.io/
 * @arg {String} `searchtext` Text to fuzzy-search in the items
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 *
 */
async function search(input: IFlowInput, args: { items: any, options: any, searchtext: string, writeToContext: boolean, store: string, stopOnError: boolean }):  Promise<IFlowInput | {}> {

    try {

        if (!args.items) return Promise.reject("items not defined or invalid.");
        if (!args.options) return Promise.reject("Options not defined or invalid.");
        if (!args.searchtext) return Promise.reject("Searchtext not defined or invalid.");

        const fuse = new Fuse(args.items, args.options);
        const result = fuse.search(args.searchtext);
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        return input;
    } catch (error) {
        return _handleError(input, error.error, args.stopOnError, args.writeToContext, args.store);
    }

}
module.exports.search = search;