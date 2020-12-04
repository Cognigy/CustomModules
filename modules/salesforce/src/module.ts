
const jsforce = require('jsforce');
import axios from 'axios';

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `soql` 1 The SOQL Query
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SOQLQuery(input: IFlowInput, args: { secret: CognigySecret, soql: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.soql) return Promise.reject("No SOQL Query defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {
        conn.query(args.soql, function (err, res) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = res;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.SOQLQuery = SOQLQuery;

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `entity` The entity type to create
 * @arg {JSON} `record` The information as JSON
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function createEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, record: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.record) return Promise.reject("No record defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    if (args.secret.loginUrl) {
      conn = new jsforce.Connection({
        loginUrl: args.secret.loginUrl
      });
    } else {
      conn = new jsforce.Connection();
    }

    conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // Single record creation
        conn.sobject(args.entity).create(args.record, function (err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = apiResult;
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.createEntity = createEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `entity` The entity type to retrieve
 * @arg {CognigyScript} `entityId` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function retrieveEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, entityId: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entityId) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    if (args.secret.loginUrl) {
      conn = new jsforce.Connection({
        loginUrl: args.secret.loginUrl
      });
    } else {
      conn = new jsforce.Connection();
    }

    conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.entity).retrieve(args.entityId, function (err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.retrieveEntity = retrieveEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `entity` The entity type to delete
 * @arg {CognigyScript} `entityId` of the entitity to delete
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function deleteEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, entityId: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entityId) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    if (args.secret.loginUrl) {
      conn = new jsforce.Connection({
        loginUrl: args.secret.loginUrl
      });
    } else {
      conn = new jsforce.Connection();
    }


    conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        conn.sobject(args.entity).destroy(args.entityId, function (err, apiResult) {
          if (err) {
            if (args.stopOnError) { reject(err.message); return; }
            else result = { "error": err.message };
          } else result = apiResult;

          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        });
      }
    });
  });
}


// You have to export the function, otherwise it is not available
module.exports.deleteEntity = deleteEntity;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `entity` The entity type to retrieve
 * @arg {String} `entityId` of the entitity to retrieve
 * @arg {JSON} `valuesToChange` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateEntity(input: IFlowInput, args: { secret: CognigySecret, entity: string, entityId: string, valuesToChange: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
  if (!args.entityId) return Promise.reject("No ID defined.");

  return new Promise((resolve, reject) => {
    let result = {};
    let conn = new jsforce.Connection();

    if (args.secret.loginUrl) {
      conn = new jsforce.Connection({
        loginUrl: args.secret.loginUrl
      });
    } else {
      conn = new jsforce.Connection();
    }

    conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
      if (err) {
        if (args.stopOnError) { reject(err.message); return; }
        result = { "error": err.message };
        if (args.writeToContext) input.context.getFullContext()[args.store] = result;
        else input.input[args.store] = result;
        resolve(input);
      } else {

        // let valuesToChangeParsed = JSON.parse(args.valuesToChange);

        if (typeof args.valuesToChange === "object") {
          const options = Object.assign({ Id: args.entityId }, args.valuesToChange);
          conn.sobject(args.entity).update(options, function (err, apiResult) {
            if (err) {
              if (args.stopOnError) { reject(err.message); return; }
              else result = { "error": err.message };
            } else result = apiResult;

            if (args.writeToContext) input.context.getFullContext()[args.store] = result;
            else input.input[args.store] = result;
            resolve(input);
          });
        } else {
          if (args.stopOnError) { reject(err.message); return; }
          result = { "error": err.message };
          if (args.writeToContext) input.context.getFullContext()[args.store] = result;
          else input.input[args.store] = result;
          resolve(input);
        }
      }
    });
  });
}

// You have to export the function, otherwise it is not available
module.exports.updateEntity = updateEntity;


/**
 * Start a Salesforce Live Chat Session
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Select[en-US,de-DE]} `language` The entity type to retrieve
 * @arg {CognigyScript} `visitorName` The name of the person
 * @arg {JSON} `prechatDetails` The Salesforce Prechat Details
 * @arg {JSON} `prechatEntities` The Salesforce Prechat Entities
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function startLiveChat(input: IFlowInput, args: { secret: CognigySecret, language: string, visitorName: string, prechatDetails?: any, prechatEntities?: any, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, language, visitorName, prechatDetails, prechatEntities, contextStore, stopOnError } = args;
  if (!secret) throw new Error("The secret is missing.");
  if (!language) throw new Error("The language is missing.");
  if (!visitorName) throw new Error("The Salesforce visitor name is missing.");
  if (!contextStore) throw new Error("The context store is missing.");

  const { liveAgentUrl, organizationId, deploymentId, livechatButtonId } = secret;
  if (!liveAgentUrl) throw new Error("The secret is missing the 'liveAgentUrl' key");
  if (!organizationId) throw new Error("The secret is missing the 'organizationId' key");
  if (!deploymentId) throw new Error("The secret is missing the 'deploymentId' key");
  if (!livechatButtonId) throw new Error("The secret is missing the 'livechatButtonId' key");

  try {
    const sessionResponse = await axios({
      method: "GET",
      url: `${liveAgentUrl}/chat/rest/System/SessionId`,
      headers: {
        "X-LIVEAGENT-AFFINITY": 'null',
        "X-LIVEAGENT-API-VERSION": '34'
      }
    });

    try {
      const initLiveChatResponse = await axios({
        method: "POST",
        url: `${liveAgentUrl}/chat/rest/Chasitor/ChasitorInit`,
        headers: {
          "X-LIVEAGENT-SESSION-KEY": sessionResponse.data.key,
          "X-LIVEAGENT-AFFINITY": sessionResponse.data.affinityToken,
          "X-LIVEAGENT-API-VERSION": '34',
          "X-LIVEAGENT-SEQUENCE": '1'
        },
        data: {
          organizationId,
          deploymentId,
          "buttonId": livechatButtonId,
          "sessionId": sessionResponse.data.id,
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36",
          language,
          "screenResolution": "1900x1080",
          visitorName,
          prechatDetails: prechatDetails || {},
          prechatEntities: prechatEntities || {},
          "receiveQueueUpdates": true,
          "isPost": true
        }
      });

      input.actions.addToContext(contextStore, {
        session: sessionResponse.data,
        startedLiveChat: initLiveChatResponse.data === "OK" ? true : false
      }, 'simple');

    } catch (error) {
      if (stopOnError) {
        throw new Error(error.message);
      } else {
        input.actions.addToContext(contextStore, { error: error.message }, 'simple');
      }
    }

  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.say("error in session Id", null);
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }


  return input;
}

// You have to export the function, otherwise it is not available
module.exports.startLiveChat = startLiveChat;


/**
 * Check if there are free live agents available for the live chat button
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function checkLiveAgentAvailability(input: IFlowInput, args: { secret: CognigySecret, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, contextStore, stopOnError } = args;
  if (!secret) throw new Error("The secret is missing.");
  if (!contextStore) throw new Error("The context store is missing.");

  const { liveAgentUrl, organizationId, deploymentId, livechatButtonId } = secret;
  if (!liveAgentUrl) throw new Error("The secret is missing the 'liveAgentUrl' key");
  if (!organizationId) throw new Error("The secret is missing the 'organizationId' key");
  if (!deploymentId) throw new Error("The secret is missing the 'deploymentId' key");
  if (!livechatButtonId) throw new Error("The secret is missing the 'livechatButtonId' key");

  try {

    const response = await axios({
      method: "GET",
      url: `${liveAgentUrl}/chat/rest/Visitor/Availability?org_id=${organizationId}&deployment_id=${deploymentId}&Availability.ids=${livechatButtonId}`,
      headers: {
        "X-LIVEAGENT-API-VERSION": '34',
      },
    })

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

// You have to export the function, otherwise it is not available
module.exports.checkLiveAgentAvailability = checkLiveAgentAvailability;


/**
 * Forwards the user message to the live agent
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The message text
 * @arg {CognigyScript} `liveAgentAffinity` Session Affinity. Stored in the Session Response.
 * @arg {CognigyScript} `liveAgentSessionKey` Session Key. Stored in the Sessoin Response.
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function sendMessageToLiveAgent(input: IFlowInput, args: { secret: CognigySecret, text: string, liveAgentAffinity: string, liveAgentSessionKey: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, liveAgentAffinity, liveAgentSessionKey, contextStore, stopOnError } = args;
  let { text } = args;
  if (!secret) throw new Error("The secret is missing.");
  if (!text) throw new Error("The user message text is missing.");
  if (!contextStore) throw new Error("The context store is missing.");
  if (!liveAgentAffinity) throw new Error("The live agent affinity is missing.");
  if (!liveAgentSessionKey) throw new Error("The live agent session key is missing.");

  const { liveAgentUrl, organizationId, deploymentId, livechatButtonId } = secret;
  if (!liveAgentUrl) throw new Error("The secret is missing the 'liveAgentUrl' key");
  if (!organizationId) throw new Error("The secret is missing the 'organizationId' key");
  if (!deploymentId) throw new Error("The secret is missing the 'deploymentId' key");
  if (!livechatButtonId) throw new Error("The secret is missing the 'livechatButtonId' key");

  try {

    const response = await axios({
      method: "POST",
      url: `${liveAgentUrl}/chat/rest/Chasitor/ChatMessage`,
      headers: {
        "X-LIVEAGENT-SESSION-KEY": liveAgentSessionKey,
        "X-LIVEAGENT-AFFINITY": liveAgentAffinity,
        "X-LIVEAGENT-API-VERSION": "34",
      },
      data: {
        text
      }
    })    

  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }

  return input;
}

// You have to export the function, otherwise it is not available
module.exports.sendMessageToLiveAgent = sendMessageToLiveAgent;


/**
 * Stops a running live chat
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `liveAgentAffinity` Session Affinity. Stored in the Session Response.
 * @arg {CognigyScript} `liveAgentSessionKey` Session Key. Stored in the Sessoin Response.
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function stopLiveChat(input: IFlowInput, args: { secret: CognigySecret, liveAgentAffinity: string, liveAgentSessionKey: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, liveAgentAffinity, liveAgentSessionKey, contextStore, stopOnError } = args;
  if (!secret) throw new Error("The secret is missing.");
  if (!contextStore) throw new Error("The context store is missing.");
  if (!liveAgentAffinity) throw new Error("The live agent affinity is missing.");
  if (!liveAgentSessionKey) throw new Error("The live agent session key is missing.");

  const { liveAgentUrl, organizationId, deploymentId, livechatButtonId } = secret;
  if (!liveAgentUrl) throw new Error("The secret is missing the 'liveAgentUrl' key");
  if (!organizationId) throw new Error("The secret is missing the 'organizationId' key");
  if (!deploymentId) throw new Error("The secret is missing the 'deploymentId' key");
  if (!livechatButtonId) throw new Error("The secret is missing the 'livechatButtonId' key");

  try {

    const response = await axios({
      method: "POST",
      url: `${liveAgentUrl}/chat/rest/Chasitor/ChatEnd`,
      headers: {
        "X-LIVEAGENT-SESSION-KEY": liveAgentSessionKey,
        "X-LIVEAGENT-AFFINITY": liveAgentAffinity,
        "X-LIVEAGENT-API-VERSION": "34",
      },
      data: {
        type: "ChatEndReason",
        reason: "client"
      }
    })

    input.actions.addToContext(contextStore, true, 'simple');

  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }

  return input;
}

// You have to export the function, otherwise it is not available
module.exports.stopLiveChat = stopLiveChat;

/**
 * Get an Agent message
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `liveAgentAffinity` Session Affinity. Stored in the Session Response.
 * @arg {CognigyScript} `liveAgentSessionKey` Session Key. Stored in the Sessoin Response.
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getAgentMessage(input: IFlowInput, args: { secret: CognigySecret, liveAgentAffinity: string, liveAgentSessionKey: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  const { secret, liveAgentAffinity, liveAgentSessionKey, contextStore, stopOnError } = args;
  const { liveAgentUrl } = secret;

  try {
      const messagesResponse = await axios({
        method: "GET",
        url: `${liveAgentUrl}/chat/rest/System/Messages`,
        headers: {
          "X-LIVEAGENT-SESSION-KEY": liveAgentSessionKey,
          "X-LIVEAGENT-AFFINITY": liveAgentAffinity,
          "X-LIVEAGENT-API-VERSION": "34",
        }
      });
  
      messagesResponse.data.messages.forEach(message => {
        if (message.type === "ChatMessage") {
          input.actions.addToContext(contextStore, message.message.text, 'simple');
          input.actions.output(message.message.text, null);
        } else {
          input.actions.addToContext(contextStore, "", 'simple');
        }
      });

  } catch (error) {
    if (stopOnError) {
      throw new Error(error.message);
    } else {
      input.actions.addToContext(contextStore, { error: error.message }, 'simple');
    }
  }

  return input;
}

module.exports.getAgentMessage = getAgentMessage;
