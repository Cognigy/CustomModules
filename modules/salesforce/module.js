const jsforce = require('jsforce');
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `soql` 1 The SOQL Query
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SOQLQuery(input, args) {
    // Check if secret exists and contains correct parameters  
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.soql)
        return Promise.reject("No SOQL Query defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            }
            else {
                conn.query(args.soql, function (err, res) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = res;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.SOQLQuery = SOQLQuery;
// TODO info in obnject ändern
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to create
 * @arg {JSON} `info` The information as JSON
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function create_entity(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.info)
        return Promise.reject("No Info defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            }
            else {
                // Single record creation
                conn.sobject(args.option).create(args.info, function (err, apiResult) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = apiResult;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.create_entity = create_entity;
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entity_id` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function retrieve_entity(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.entity_id)
        return Promise.reject("No ID defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            }
            else {
                conn.sobject(args.option).retrieve(args.entity_id, function (err, apiResult) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = apiResult;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.retrieve_entity = retrieve_entity;
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to delete
 * @arg {String} `entity_id` of the entitity to delete
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function delete_entity(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.entity_id)
        return Promise.reject("No ID defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        var conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            }
            else {
                conn.sobject(args.option).destroy(args.entity_id, function (err, apiResult) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = apiResult;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.delete_entity = delete_entity;
/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {String} `option` The entity type to retrieve
 * @arg {String} `entity_id` of the entitity to retrieve
 * @arg {JSON} `values_to_change` of the entitity to retrieve
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function update_entity(input, args) {
    // Check if secret exists and contains correct parameters
    if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token)
        return Promise.reject("Secret not defined or invalid.");
    if (!args.entity_id)
        return Promise.reject("No ID defined.");
    return new Promise((resolve, reject) => {
        let result = {};
        let conn = new jsforce.Connection();
        conn.login(args.secret.username, args.secret.password + args.secret.token, function (err, res) {
            if (err) {
                if (args.stopOnError) {
                    reject(err.message);
                    return;
                }
                result = { "error": err.message };
                if (args.writeToContext)
                    input.context.getFullContext()[args.store] = result;
                else
                    input.input[args.store] = result;
                resolve(input);
            }
            else {
                let valuesToChange = JSON.parse(args.values_to_change);
                const options = Object.assign({ Id: args.entity_id }, valuesToChange);
                conn.sobject(args.option).update(options, function (err, apiResult) {
                    if (err) {
                        if (args.stopOnError) {
                            reject(err.message);
                            return;
                        }
                        else
                            result = { "error": err.message };
                    }
                    else
                        result = apiResult;
                    if (args.writeToContext)
                        input.context.getFullContext()[args.store] = result;
                    else
                        input.input[args.store] = result;
                    resolve(input);
                });
            }
        });
    });
}
// You have to export the function, otherwise it is not available
module.exports.update_entity = update_entity;
// /**
//  * Describes the function
//  * @arg {SecretSelect} `secret` The configured secret to use
//  * @arg {String} `option` The entity type to delete
//  * @arg {String} `entity_id` of the entitity to delete
//  * @arg {JSON} `values_to_change` of the entitity
//  * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
//  * @arg {CognigyScript} `store` Where to store the result
//  * @arg {Boolean} `stopOnError` Whether to stop on error or continue
//  */
// async function update_entity(input: IFlowInput, args: { secret: CognigySecret, option: string, entity_id: string, values_to_change: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
//
//   // Check if secret exists and contains correct parameters
//   if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.token) return Promise.reject("Secret not defined or invalid.");
//   if (!args.entity_id) return Promise.reject("No ID defined.");
//
//   return new Promise((resolve, reject) => {
//     let result = {};
//     var conn = new jsforce.Connection();
//
//
//     conn.login(args.secret.username, args.secret.password + args.secret.token, function(err, res) {
//       if (err) {
//         if (args.stopOnError) { reject(err.message); return; }
//         result = { "error": err.message };
//         if (args.writeToContext) input.context.getFullContext()[args.store] = result;
//         else input.input[args.store] = result;
//         resolve(input);
//       } else {
//
//
//         const valuesToChange = JSON.parse(args.values_to_change);
//
//         const options = Object.assign({ Id : args.entity_id }, valuesToChange);
//         input.actions.output("Starting", "");
//         input.actions.output("Options", options);
//         input.actions.output("Ending","");
//
//         conn.sobject(args.option).update(options, function(err, apiResult) {
//           if (err) {
//             if (args.stopOnError) { reject(err.message); return; }
//             else result = { "error": err.message};
//
//           } else result = apiResult;
//
//           if (args.writeToContext) input.context.getFullContext()[args.store] = result;
//           else input.input[args.store] = result;
//           resolve(input);
//         });
//       }
//     });
//
//   });
// }
//
// // 0031t00000D508kAAB
//
//
// // You have to export the function, otherwise it is not available
// module.exports.update_entity = update_entity;
//# sourceMappingURL=module.js.map