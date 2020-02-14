const Hubspot = require('hubspot');

/**
 * Finds a Contact by their eMail address in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `email` The email address to search
 * @arg {CognigyScript} `properties` Which properties to include
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function findContactByEmail(input: IFlowInput, args: { secret: CognigySecret, email: string, writeToContext: boolean, properties: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.email) return Promise.reject("No email defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.contacts.getByEmail(args.email, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else {
				const properties = (args.properties) ? args.properties.split(",") : [];
				if (properties.indexOf("vid") === -1) properties.push("vid");
				Object.keys(res.properties).forEach((key) => {

					// if key isn't in the defined properties, delete it
					if (properties.indexOf(key) === -1) {
						delete res.properties[key]
					}
					else if (key === "properties") {
						// if the key is properties, remove versions
						Object.keys(res[key]).forEach((propkey) => {
							delete res[key][propkey]["versions"];
						});
					}
				});
				result = res;
			}

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Update a Contact in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Number} `vid` The Hubspot Contact ID (vid)
 * @arg {JSON} `data` The update data
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateContact(input: IFlowInput, args: { secret: CognigySecret, vid: number, data: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.vid) return Promise.reject("No vid defined.");
	if (!args.data) return Promise.reject("No data defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.contacts.update(args.vid, args.data, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Create a Contact in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `data` The contact data
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createContact(input: IFlowInput, args: { secret: CognigySecret, data: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.data) return Promise.reject("No data defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.contacts.create(args.data, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Searches for a Contact in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `query` The query to search for
 * @arg {CognigyScript} `properties` Which properties to include
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function findContact(input: IFlowInput, args: { secret: CognigySecret, query: string, properties: string, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.query) return Promise.reject("No query defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.contacts.search(args.query, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else {
				const contacts = (res.contacts && Array.isArray(res.contacts) && res.contacts.length > 0) ? res.contacts : null;
				const properties = (args.properties) ? args.properties.split(",") : [];
				if (properties.indexOf("vid") === -1) properties.push("vid");
				if (contacts) {
					contacts.forEach((res) => {
						Object.keys(res.properties).forEach((key) => {
							// if key isn't in the defined properties, delete it
							if (properties.indexOf(key) === -1) delete res.properties[key];
							else if (key === "properties") {
								// if the key is properties, remove versions
								Object.keys(res[key]).forEach((propkey) => {
									delete res[key][propkey]["versions"];
								});
							}
						});
					})
				}
				result = res;
			}
			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Finds a Company in Hubspot by Domain
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `domain` Domain of the company (e.g. cognigy.com)
 * @arg {CognigyScript} `properties` Which properties to include
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function findCompanyByDomain(input: IFlowInput, args: { secret: CognigySecret, domain: string, writeToContext: boolean, properties: string, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.domain) return Promise.reject("No domain defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.companies.getByDomain(args.domain, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else {
				const properties = (args.properties) ? args.properties.split(",") : [];
				if (properties.indexOf("companyId") === -1) properties.push("companyId");

				if (res && Array.isArray(res) && res.length > 0) {
					res.forEach((company) => {
						Object.keys(company.properties).forEach((key) => {
							// if key isn't in the defined properties, delete it
							if (properties.indexOf(key) === -1) delete company.properties[key];
							else if (key === "properties") {
								// if the key is properties, remove versions
								Object.keys(company[key]).forEach((propkey) => {
									delete company[key][propkey]["versions"];
								});
							}
						});
					})
				}
				result = res;
			}
			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Create a Company in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `data` Company Data
 * @arg {CognigyScript} `properties` Which properties to include
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createCompany(input: IFlowInput, args: { secret: CognigySecret, data: any, writeToContext: boolean, properties: string, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.data) return Promise.reject("No data defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.companies.create(args.data, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Updates a Company in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Number} `companyId` Hubspot ID of the company
 * @arg {JSON} `data` Company Data
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function updateCompany(input: IFlowInput, args: { secret: CognigySecret, companyId: number, data: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.companyId) return Promise.reject("No companyId defined.");
	if (!args.data) return Promise.reject("No data defined.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.companies.update(args.companyId, args.data, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Create an Engagement (e.g. task) in Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `data` Engagement  Data
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function createEngagement(input: IFlowInput, args: { secret: CognigySecret, data: any, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");
	if (!args.data) return Promise.reject("No data defined.");
	
	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.engagements.create(args.data, (err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

/**
 * Retrieve all owner users from Hubspot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getOwners(input: IFlowInput, args: { secret: CognigySecret, writeToContext: boolean, store: string, stopOnError: boolean }): Promise<any> {
	if (!args.secret || !args.secret.apiKey) return Promise.reject("Secret not defined or invalid.");

	const hubspot = new Hubspot({ apiKey: args.secret.apiKey });
	if (hubspot.qs && typeof hubspot.qs === 'object') hubspot.qs.propertyMode = 'value_only';
	let result = {};

	return new Promise((resolve, reject) => {
		hubspot.owners.get((err, res) => {
			if (err) {
				// if an error was triggered, either reject or write error to store
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else result = res;

			return Promise.resolve(result);
		})
			.catch((err) => {
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
				return Promise.resolve(result);
			})
			.then((res) => {
				if (!res) return;
				if (args.writeToContext) input.context.getFullContext()[args.store] = result;
				else input.input[args.store] = result;
				resolve(input);
			});
	});
}

module.exports.findContactByEmail = findContactByEmail;
module.exports.createContact = createContact;
module.exports.updateContact = updateContact;
module.exports.findContact = findContact;
module.exports.findCompanyByDomain = findCompanyByDomain;
module.exports.createCompany = createCompany;
module.exports.updateCompany = updateCompany;
module.exports.createEngagement = createEngagement;
module.exports.getOwners = getOwners;