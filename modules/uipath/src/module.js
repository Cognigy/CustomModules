const request = require('request-promise-native');
const uuid = require('uuid');

const { getToken, getQueueItemHelper, addQueueItemHelper } = require('./api');

/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `queueName` The queue that the payload should be send to (this will be added to the payload.)
 * @arg {CognigyScript} `resultQueueId` The id of the queue where the result message will be stored (looks for item.ResultId)
 * @arg {select[Low,Normal,High]} `priority` Select the priority of the queueItem
 * @arg {JSON} `specificContent` The JSON payload
 * @arg {CognigyScript} `timeOut` A timeout setting for waiting for the response
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function addQueueItem(input, args) {

	const { secret, queueName, priority, specificContent, contextStore } = args;
	const { client_id, refresh_token } = secret;

	if (!secret) throw new Error("The secret is not defined. Please define a UIPath Cognigy ");
	if (!queueName) throw new Error(" No queue name is defined.");
	if (!priority) throw new Error("Please select a priority.");
	if (!specificContent) throw new Error("No specific content is defined.");
	if (!contextStore) throw new Error("No context store is defined.");

	if (!client_id) throw new Error("The secret is missing the 'client_id' field.");
	if (!refresh_token) throw new Error("The secret is missing the 'refresh_token' field.");

	try {

		const tokenResult = await getToken({
			client_id,
			refresh_token
		});

		const resultId = uuid.v4();

		const queueItem = {
			itemData: {
				Name: queueName,
				Priority: priority,
				SpecificContent: {
					...specificContent,
					ResultId: resultId,
					'ResultId@odata.type': '#String',
				}
			}
		};

		const addQueueItemResponse = await addQueueItemHelper(queueItem, {
			access_token: tokenResult.access_token,
			account_logical_name: account_logical_name,
			service_instance_logical_name: service_instance_logical_name
		});

		input.actions.addToContext(contextStore, addQueueItemResponse, 'simple');

	} catch (error) {
		if (stopOnError) {
			throw new Error(error.message);
		}
		else {
			input.actions.addToContext(contextStore, { error: error.message }, 'simple');
		}
	}

	return input;
}

// You have to export the function, otherwise it is not available
module.exports.addQueueItem = addQueueItem;

/**
 * Polls for a queue item by OData filter
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `filter` The filter string
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getQueueItem(input, args) {

	const { secret, filter, contextStore, stopOnError } = args;
	const { client_id, refresh_token } = secret;

	if (!secret) throw new Error("The secret is not defined. Please define a UIPath Cognigy ");
	if (!filter) throw new Error(" No filter is defined.");
	if (!contextStore) throw new Error("No context store is defined.");

	if (!client_id) throw new Error("The secret is missing the 'client_id' field.");
	if (!refresh_token) throw new Error("The secret is missing the 'refresh_token' field.");

	try {

		const tokenResult = await getToken({
			client_id,
			refresh_token
		});


		const queueItem = await (async () => {
			for (let polls = 0; polls < 15; polls++) {
				try {
					return await addQueueItemHelper({
						filter
					},
						{
							access_token: tokenResult.access_token,
							account_logical_name: account_logical_name,
							service_instance_logical_name: service_instance_logical_name
						});
				} catch (error) {
					input.actions.log('error', 'Could not find item in return queue.')
				}

				await new Promise(r => setTimeout(r, 1000));
			}

			throw new Error('maximum polling retries reached!');
		})();

		input.actions.addToContext(contextStore, queueItem, 'simple');
	} catch (error) {
		if (stopOnError) {
			throw new Error(error.message);
		}
		else {
			input.actions.addToContext(contextStore, { error: error.message }, 'simple');
		}
	}

	return input;
}

module.exports.getQueueItem = getQueueItem;


/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getReleases(input, args) {

	const { secret, account_logical_name, service_instance_logical_name, contextStore, stopOnError } = args;
	const { client_id, refresh_token } = secret;

	if (!secret) throw new Error("The secret is not defined. Please define a UIPath Cognigy ");
	if (!account_logical_name) throw new Error("No account logical name is defined.");
	if (!service_instance_logical_name) throw new Error("No service instance logical name is defined.");
	if (!contextStore) throw new Error("No context store is defined.");

	if (!client_id) throw new Error("The secret is missing the 'client_id' field.");
	if (!refresh_token) throw new Error("The secret is missing the 'refresh_token' field.");

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {

		let response;
		// if there is an error, handle it according to the best practice guide

		let accessToken;

		let options = {
			method: 'POST',
			uri: 'https://account.uipath.com/oauth/token',
			body: {
				grant_type: "refresh_token",
				client_id,
				refresh_token
			},
			json: true // Automatically stringifies the body to JSON
		};

		request(options)
			.then(function (parsedBody) {
				response = parsedBody;
				accessToken = parsedBody.access_token;

				let finalOptions = {
					method: 'GET',
					url: `https://platform.uipath.com/${account_logical_name}/${service_instance_logical_name}/odata/Releases`,
					headers: {
						'Content-Type': 'application/json',
						'X-UIPATH-TenantName': service_instance_logical_name
					},
					auth: {
						'bearer': accessToken
					},
					json: true
				};

				request(finalOptions)
					.then((jobs) => {
						input.actions.addToContext(contextStore, jobs, 'simple');
						resolve(input);

					})
					.catch((err) => {
						if (stopOnError) { reject(err); return; }
					})
			})
			.catch((err) => {
				if (stopOnError) { reject(err); return; }

			});
	});
}

// You have to export the function, otherwise it is not available
module.exports.getReleases = getReleases;



/**
 * Describes the function
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getJobs(input, args) {
	
	const { secret, account_logical_name, service_instance_logical_name, contextStore, stopOnError } = args;
	const { client_id, refresh_token } = secret;

	if (!secret) throw new Error("The secret is not defined. Please define a UIPath Cognigy ");
	if (!account_logical_name) throw new Error("No account logical name is defined.");
	if (!service_instance_logical_name) throw new Error("No service instance logical name is defined.");
	if (!contextStore) throw new Error("No context store is defined.");

	if (!client_id) throw new Error("The secret is missing the 'client_id' field.");
	if (!refresh_token) throw new Error("The secret is missing the 'refresh_token' field.");

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {
		let result = {}
		let response;
		// if there is an error, handle it according to the best practice guide

		let accessToken;

		let options = {
			method: 'POST',
			uri: 'https://account.uipath.com/oauth/token',
			body: {
				grant_type: "refresh_token",
				client_id,
				refresh_token
			},
			json: true // Automatically stringifies the body to JSON
		};

		request(options)
			.then(function (parsedBody) {
				response = parsedBody;
				accessToken = parsedBody.access_token;

				let finalOptions = {
					method: 'GET',
					url: `https://platform.uipath.com/${account_logical_name}/${service_instance_logical_name}/odata/Jobs`,
					headers: {
						'Content-Type': 'application/json',
						'X-UIPATH-TenantName': service_instance_logical_name
					},
					auth: {
						'bearer': accessToken
					},
					json: true
				};

				request(finalOptions)
					.then((jobs) => {

						input.actions.addToContext(contextStore, jobs, 'simple');
						resolve(input);

					})
					.catch((err) => {
						if (stopOnError) { reject(err); return; }
					})

			})
			.catch((err) => {
				if (stopOnError) { reject(err); return; }

			});
	});
}

// You have to export the function, otherwise it is not available
module.exports.getJobs = getJobs;


/**
 * Trigger a specific Job
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `releaseKey` The releaseKey. Use the GetReleases request to obtain the key. 
 * @arg {select[Specific,All]} `strategy` The job strategy
 * @arg {CognigyScript} `robotId` The ID of the Robot that needs to be triggered
 * @arg {JSON} `inputArguments` The JSON payload
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function startJob(input, args) {

	const { secret, inputArguments, releaseKey, robotId, strategy, account_logical_name, service_instance_logical_name, contextStore, stopOnError } = args;
	const { client_id, refresh_token } = secret;

	if (!secret) throw new Error("The secret is not defined. Please define a UIPath Cognigy ");
	if (!account_logical_name) throw new Error("No account logical name is defined.");
	if (!service_instance_logical_name) throw new Error("No service instance logical name is defined.");
	if (!releaseKey) throw new Error("Please provide a valid Release Key. Use the GetReleases operation to get a list of releases.");
	if (!robotId) throw new Error("Please provide a valid Robot ID.");
	if (!strategy) throw new Error("No Strategy specified. Please specify a Strategy.");
	if (!contextStore) throw new Error("No context store is defined.");

	if (!client_id) throw new Error("The secret is missing the 'client_id' field.");
	if (!refresh_token) throw new Error("The secret is missing the 'refresh_token' field.");


	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {

		let response;
		// if there is an error, handle it according to the best practice guide

		let accessToken;

		let options = {
			method: 'POST',
			uri: 'https://account.uipath.com/oauth/token',
			body: {
				grant_type: "refresh_token",
				client_id,
				refresh_token
			},
			json: true // Automatically stringifies the body to JSON
		};

		request(options)
			.then(function (parsedBody) {
				response = parsedBody;
				accessToken = parsedBody.access_token;

				let job = {
					"startInfo":
					{
						"ReleaseKey": releaseKey,
						"Strategy": strategy,
						"RobotIds": [Number.parseInt(robotId)],
						"NoOfRobots": 0,
						"Source": "Manual",
						"InputArguments": JSON.stringify(inputArguments)
					}
				}

				let finalOptions = {
					method: 'POST',
					url: `https://platform.uipath.com/${account_logical_name}/${service_instance_logical_name}/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs`,
					headers: {
						'Content-Type': 'application/json',
						'X-UIPATH-TenantName': service_instance_logical_name
					},
					auth: {
						'bearer': accessToken
					},
					body: job,
					json: true
				};

				request(finalOptions)
					.then((result) => {

						input.actions.addToContext(contextStore, result, 'simple');
						resolve(input);

					})
					.catch((err) => {
						if (stopOnError) { reject(err); return; }
					});
			})
			.catch((err) => {
				if (stopOnError) { reject(err); return; }
			});
	});
}

module.exports.startJob = startJob;