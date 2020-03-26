# Get Started

In this tutorial we want to show you how to develop your first custom module, which you can upload and install in your existing Cognigy.AI project. 

## Requirements 

However, in order to start this tutorial, you need the following requirements:

- Basic TypeScript / JavaScript knowledge
- A code editor
    - We recommend using [Visual Studio Code](https://code.visualstudio.com/?wt.mc_id=DX_841432)
- An existing Cogngiy.AI [project](https://docs.cognigy.com/docs/projects)
    - If you don't have a project yet, but want to get familiar with Cognigy, we provide registering in our [Cognigy Community Cloud](https://hello.cognigy.com/cognigy-community-cloud). It is totally free and the best way to get in touch with our product.

## Create the module structure

Every module has the same folder and file structure:

``` bash
module-name/
    README.md
    src/
        module.ts
    package.json
    package-lock.json
    tslint.json
    tsconfig.json
    icon.png
    icon-large.png
```

This structure includes all required resources to **build** and **upload** the module to Cognigy.AI. The `README.md` is used to show the module's content in the Integration Framework and here on GitHub. Thus, other developers or interested usrs can get familiar with the functionality of our module. The entire source code of our exposed [Flow Nodes](https://docs.cognigy.com/docs/general-usage-information) is located in the `src/module.ts` file, in which the next four files (`package.json`, `package-lock.json`, `tslint.json`, `tsconfig.json`) are used to create the Javascript module and check it for mistakes. The two icons are required to show the module's logo in Cognigy. In most cases, the icons show the logo of the third-party software product which we are integrating with this module. 

**Notes:**
- You don't need to write the module is TypeScript. If you prefer using JavaScript, remove the `tslint.json` and `tsconfig.json`. 
- The `icon.png` needs to have the following dimensions:
    - 64x64 Pixels

**The example module structure can be copied from the [Custom Module Template](./template)**.

## Develop a Custom Flow Node

Since most of the modules are developed in TypeScript, the following example will use it as well. We will create a small and simple node which reads out loud a Chuck Norris joke.

### The Source Code

In your exmample module, navigate to the `src/module.ts` file and delete the template code.

First, we have to define an exported TypeScript function which represents the Flow Node that is uploaded to Cognigy later.

```typescript
function tellJoke(input: IFlowInput, args: { contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // return the input object to continue with the conversation.
    return input;
}

// export the module to access it in Cognigy.
module.exports.tellJoke = tellJoke;
```

This is the basic function we need to develop for our module. It takes the parameters `input` and `args`:

-  `input`:
    - Input contains all Cognigy actions you may know from the web application. For example, you could use `input.actions.say()` to make use of the [Say Node](https://docs.cognigy.com/docs/say-nodes) in within your module.
- `args`:
    - This object is used to get all provided arguments from the Cogngiy.AI platform and use them inside the module. The two already defined ones are `contextStore` and `stopOnError`. 
        - `contextStore`:
            - Where should a possible module response be stored in the [Cognigy Context](https://docs.cognigy.com/docs/context-object)
            - If your module don't need to store something, you can delete this argument.
        - `stopOnError`:
            - If you execute code that could end in an error, the conversation designer should be able to stop the flow if this module breaks.

The only thing that is missing, is the visualization of our Flow Node inside Cognigy. The Integration Framework uses a specific comment structure to render the view for the user. In this case, this view definition looke like the following:

```typescript
/**
 * This node returns a random Chuck Norris joke
 * @arg {CognigyScript} `contextStore` Where to store the result in the Cognigy Context object.
 * @arg {Boolean} `stopOnError` Whether to stop the Flow on error or continue.
 */
```

The first line describes the module in one or two sentences. It is required to give an overview of the functionlity this module is providing. The rest is used to define how the user [input fields](https://docs.cognigy.com/docs/integration-framework#section-input-types) are rendered:

```typescript
/**
* @arg{<Type>} `<argument-name>` <argument-description>
**/
```

### Build and Install the module

Even if the module does nothing at the moment, we can build, upload and install it. In order to do so, the following commands needs to be executed in the command line:

- `cd <path/to/your/module/folder>`
    - Navigate to your module's root folder.
- `npm ci`
    - Install all required [NPM](https://www.npmjs.com/) packages.
- `npm run build`
    - Build the module and translate TypeScript to JavaScript. Note that if the build process returns an error, it could be the case that the linter we are using wants you to change the syntax of the code.

Now the module's root folder should contain a `module.zip` file. This file now can be uploaded to your existing Cognigy.AI project.

*Note:* \
*If there is no `module.zip` file after running `npm run build`, please make sure that you copied the `package.json` from the example [Custom Module Template](../../modules/template).*

## Adding the Chuck Norris Joke Functionality

Since we defined that our custom module shall return a random Chuck Norris joke, we have to add some code to our existing `tellJoke()` function.

For this new functionality, we need two code extenstions:

1. Calling the [Chuck Norris Joke API](https://api.chucknorris.io/jokes/random)
2. Return the retreived joke to the Cognigy.AI


We will use [Axios](https://www.npmjs.com/package/axios), a promise based HTTP client for the browser and node.js. This module will call the API and store the result in a local variable.

1. We need to install the node module
    - `npm i axios`
    - `npm i @types/axios`

2. We have to import the module in our code.
    - `import axios from 'axios';`

Taking a look at our already declared function, we have to add the following code:

```typescript
import axios from 'axios';

/**
 * This node returns a random Chuck Norris joke
 * @arg {CognigyScript} `contextStore` Where to store the result in the Cognigy Context object.
 * @arg {Boolean} `stopOnError` Whether to stop the Flow on error or continue.
 */
async function tellJoke(input: IFlowInput, args: { contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    // get the parameters from the arguments object.
    const { contextStore, stopOnError } = args;

    // show an error in Cognigy.AI if the context store is not defined.
    if (!contextStore) throw new Error("The context store key is not defined. You need it to store the result into the Cognigy Context object.");


    // try to call the API async. Catch possible errors and handle them.
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

        /*
        Now the Cognigy user is able to get the joke by using CognigyScript:
            - {{cc.joke}}
        */

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
module.exports.tellJoke = tellJoke;
```

Now you can rebuild the module and upload it again.

**Congratulations, you developed your first custom module!**