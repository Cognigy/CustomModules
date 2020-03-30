# Best Practices

In order to guarantee a uniform user experiences, we have set up a number of best practices

## 1. Always include a README.md

Include a readme file for developers to learn about requirements for Secrets and the exposed functionality.

## 2. Always return a Promise with the Input Object
Unless you return a Promise with the Input object, the Flow will stop. Always return it (unless you'd like to throw an error, see below).

## 3. Make sure all necessary arguments are present
Always test if all necessary input parameters are present.

## 4. Use of Secrets
If your modules requires authentication against a third party service, you should use Cognigy Secrets for that purpose. Secrets are defined in the UI by an administrator and can be passed into the Node as a Node Argument.

At the start of your function, check if the secret contains the required keys and if not, return a rejected Promise, which will abort the Flow and show an error in the Cognigy UI.

## 5. Handling Results
Try to limit the result size to what is necessary! For example if an API returns all versions of a property, go through them and remove all properties that are not the newest.

Results can be either written to the Input or the Context objects. We recommend to make this configurable through a Node Argument.

- Create a Node Argument `writeToContext` of type `boolean`
- If this is false, write the result of your function to the Input object (input.input)
- If this is true, retrieve the Context (`input.context.getFullContext()`) and store the result into the Context

## 6. Error Handling
Errors can be handled in two ways:

1. Returning a rejected Promise will abort the Flow and show an error in the UI. Note that non-UI users (e.g. on Facebook or Alexa) won't see any output!
2. Errors can be written into the results for the Node, enabling the Flow to handle them

As best practice, we recommend the following:

- Always have a Node Argument `stopOnError` of type `boolean`
- If the argument is false, write the error into the result object and return a resolved Promise
- If the argument is true, return a rejected Promise with the error as the argument

## 7. Testing
Make sure to test against the following scenarios:

- Works as intended
- Secret is incorrect or missing key - is it handled?
- Service not available - is it handled?

## 8. Troubleshooting
If you face issues when uploading the module, check below for possible resolutions. 

**Failed to store custom module information in database.**

This error can happen if the descriptors (the comments of a custom module function) are incorrectly formatted. One common issue is the use of the incorrect single quotes. Argument names have to be encircled in ` rather than '.
