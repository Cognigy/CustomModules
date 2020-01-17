

/**
 * Get all K2 workflows for the given endpoint
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getWorkflows(input: IFlowInput, args: { secret: CognigySecret, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const rp = require('request-promise');

  /* validate node arguments */
  const { secret, writeToContext, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (writeToContext === undefined) throw new Error("Write to context flag not defined.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username } = secret;
  const { password } = secret;
  const { endpoint } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.")
  if (!password) throw new Error("Secret is missing the 'password' field.")
  if (!endpoint) throw new Error("Secret is missing the 'password' field.")

  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      auth: {
        user: username,
        password: password
      },
      uri: `${endpoint}/api/workflow/preview/workflows`,
      json: true,
  };
  
  rp(options)
      .then((result) => {
        if (writeToContext) input.actions.addToContext(store, result, 'simple');
        else input.input[store] = result;
        resolve(input);
      })
      .catch((err) => {
        if (args.stopOnError) { reject(err.message); return; }
        input.input[store] = { error: err.message };
        resolve(input);
      });
  });
}

module.exports.getWorkflows = getWorkflows;

/**
 * Get all K2 workflows for the given endpoint
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `id` The id of the workflow that needs to be triggerd
 * @arg {JSON} `payload` 
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function triggerWorkflow(input: IFlowInput, args: { secret: CognigySecret, id: string,  writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const rp = require('request-promise');

  /* validate node arguments */
  const { secret, writeToContext, store, stopOnError } = args;
  if (!secret) throw new Error("Secret not defined.");
  if (writeToContext === undefined) throw new Error("Write to context flag not defined.");
  if (!store) throw new Error("Context store not defined.");
  if (stopOnError === undefined) throw new Error("Stop on error flag not defined.");

  /* validate secrets */
  const { username } = secret;
  const { password } = secret;
  const { endpoint } = secret;
  if (!username) throw new Error("Secret is missing the 'username' field.")
  if (!password) throw new Error("Secret is missing the 'password' field.")
  if (!endpoint) throw new Error("Secret is missing the 'password' field.")

  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      auth: {
        user: username,
        password: password
      },
      uri: `${endpoint}/api/workflow/preview/workflows`,
      json: true,
  };
  
  rp(options)
      .then((result) => {
        if (writeToContext) input.actions.addToContext(store, result, 'simple');
        else input.input[store] = result;
        resolve(input);
      })
      .catch((err) => {
        if (args.stopOnError) { reject(err.message); return; }
        input.input[store] = { error: err.message };
        resolve(input);
      });
  });
}

module.exports.triggerWorkflow = triggerWorkflow;
