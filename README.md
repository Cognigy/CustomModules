# Cognigy Integration Framework Modules
In Cognigy.AI, Conversational AIs are configured in so-called Flows, which contain the NLP/NLU configuration and then a decision tree to formulate the output to the user or trigger actions in third party systems. 

The Cognigy Integration Framework enables anyone to build JavaScript modules and to expose these are Nodes within a Cognigy Flow. There are no restrictions on NPMs or functionality.

On shared environments (e.g. SaaS, Demo), Cognigy will review the modules before publishing them.

This repository contains the source code of existing Custom Modules which can be used as blueprints for further developments.

All Cognigy Custom Modules are provided under the MIT license.

## Installation (Download)
We are providing all modules as ready-to-install zipped releases.

1. Download the module you'd like to install from our [Releases](https://github.com/Cognigy/CustomModules/releases) page.
2. Upload the zipped module into your Cognigy.AI installation through the [Cognigy Integration Framework manager](https://docs.cognigy.com/docs/integration-framework#section-4-upload-your-module).

## Installation (Source)
All modules in this repository are provided as [TypeScript](https://www.typescriptlang.org/) source code which can be transpiled to JavaScript. In order to use them in your Cognigy.AI installation, you need to perform the following steps:

1. Clone the repository
2. Navigate to a module folder (e.g. modules/salesforce), run `npm install` to install dependencies and `tsc` to transpile the module from TypeScript to JavaScript
3. Zip the root of the module and the /build folder
4. Upload the zipped module into your Cognigy.AI installation through the [Cognigy Integration Framework manager](https://docs.cognigy.com/docs/integration-framework#section-4-upload-your-module).

>In shared Cognigy.AI environments only Cognigy-approved Custom Modules may be uploaded.

## Best Practices
In order to guarantee a uniform user experiences, we have set up a number of best practices

### Always include a README.md
Include a readme file for developers to learn about requirements for Secrets and the exposed functionality.

### Always return a Promise with the Input Object
Unless you return a Promise with the Input object, the Flow will stop. Always return it (unless you'd like to throw an error, see below).

### Make sure all necessary arguments are present
Always test if all necessary input parameters are present.

### Use of Secrets
If your modules requires authentication against a third party service, you should use Cognigy Secrets for that purpose. Secrets are defined in the UI by an administrator and can be passed into the Node as a Node Argument.

At the start of your function, check if the secret contains the required keys and if not, return a rejected Promise, which will abort the Flow and show an error in the Cognigy UI.

### Handling Results
Try to limit the result size to what is necessary! For example if an API returns all versions of a property, go through them and remove all properties that are not the newest.

Results can be either written to the Input or the Context objects. We recommend to make this configurable through a Node Argument.

- Create a Node Argument `writeToContext` of type `boolean`
- If this is false, write the result of your function to the Input object (input.input)
- If this is true, retrieve the Context (`input.context.getFullContext()`) and store the result into the Context

### Error Handling
Errors can be handled in two ways:

1. Returning a rejected Promise will abort the Flow and show an error in the UI. Note that non-UI users (e.g. on Facebook or Alexa) won't see any output!
2. Errors can be written into the results for the Node, enabling the Flow to handle them

As best practice, we recommend the following:

- Always have a Node Argument `stopOnError` of type `boolean`
- If the argument is false, write the error into the result object and return a resolved Promise
- If the argument is true, return a rejected Promise with the error as the argument

### Testing
Make sure to test against the following scenarios:

- Works as intended
- Secret is incorrect or missing key - is it handled?
- Service not available - is it handled?

## Troubleshooting
If you face issues when uploading the module, check below for possible resolutions. 

**Failed to store custom module information in database.**
This error can happen if the descriptors (the comments of a custom module function) are incorrectly formatted. One common issue is the use of the incorrect single quotes. Argument names have to be encircled in ` rather than '.
