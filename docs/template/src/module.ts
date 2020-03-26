/*
Import any node module from npmjs.com to add functionality to your module.
*/

import axios from 'axios';


/**
 * Describe your module with one or two
 * @arg {CognigyScript} `contextStore` Where to store the result in the Cognigy Context object.
 * @arg {Boolean} `stopOnError` Whether to stop the Flow on error or continue.
 */
async function exampleNodeAsync(input: IFlowInput, args: { contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // get the parameters from the arguments object.
    const { contextStore, stopOnError } = args;

    // show an error in Cognigy.AI if the context store is not defined.
    if (!contextStore) throw new Error("The context store key is not defined. You need it to store the result into the Cognigy Context object.");


    // try to call an API async. Catch possible errors and handle them.
    try {

        const response = await axios({
            method: 'get',
            url: 'https://api.chucknorris.io/jokes/random',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // extract the joke from the API response.
        const joke: string = response.data.value;

        // store the retreived joke to the Cognigy Context object.
        input.actions.addToContext(contextStore, joke, 'simple');



    } catch (error) {
        // if stopOnError is true, stop the flow and throw an error in the Cognigy User Interface.
        if (stopOnError) {
            throw new Error(`Error in Tell Joke node: ${error.message}.`);
        } else {
            // else store the error into the Cognigy Context.
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    // return the input object to continue with the conversation.
    return input;
}

// export the module to access it in Cognigy.
module.exports.exampleNodeAsync = exampleNodeAsync;


/**
 * Describe your module with one or two
 * @arg {CognigyScript} `contextStore` Where to store the result in the Cognigy Context object.
 * @arg {Boolean} `stopOnError` Whether to stop the Flow on error or continue.
 */
async function exampleNode(input: IFlowInput, args: { contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // get the parameters from the arguments object.
    const { contextStore, stopOnError } = args;

    // show an error in Cognigy.AI if the context store is not defined.
    if (!contextStore) throw new Error("The context store key is not defined. You need it to store the result into the Cognigy Context object.");

    // use the Cogngiy API to execute a SAY node
    input.actions.say('hello world', {
        "key": "value"
    });

    // return the input object to continue with the conversation.
    return input;
}

// export the module to access it in Cognigy.
module.exports.exampleNode = exampleNode;