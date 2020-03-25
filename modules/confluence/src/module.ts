const rp = require('request-promise');

/**
 * This generates a custom Lexicon based on the labels within a certain Confluence Space. 
 * This typically needs to be used only once to generate a lexicon. The lexicon itself will be persisted automatically. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `confluenceSpace` The Space for which a lexicon should be generated
 * @arg {CognigyScript} `lexiconId` The ID of the relevant lexicon. Can be obtained by created a lexicon and copying the ID (menu, top-right corner).
 * @arg {CognigyScript} `lexiconTagName` The name of the lexicon Tag (e.g. Device or Product or ...)
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function generateLexicon(input: IFlowInput, args: 
	{ 
		secret: CognigySecret, 
		confluenceSpace: string, 
		lexiconId: string, 
		lexiconTagName: string, 
		writeToContext: boolean, 
		store: string, 
		stopOnError: boolean 
	}): Promise<IFlowInput | {}> {

	// Check if secret exists and contains correct parameters  
	if (!args.secret || !args.secret.password) return Promise.reject("Secret not defined or invalid.");

	// Check if Space is provided
	if (!args.confluenceSpace) return Promise.reject("Please provide a valid Confluence Space (e.g. KNOW)");

	// Check if Lexicon is provided
	if (!args.lexiconId) return Promise.reject("Please provide a valid LexiconId. You can find the lexicon id by opening a lexicon and clicking on the top right menu (3 dots)");

	if (!args.lexiconTagName) return Promise.reject("Please provide a valid Tag name");

	const config = {
		username: args.secret.username,
		password: args.secret.password,
		baseUrl:  args.secret.baseUrl
	};

	let options = {
		uri: `${config.baseUrl}/wiki/rest/api/content?spacekey=${args.confluenceSpace}&expand=metadata.labels`,
		auth: {
			'username': config.username,
			'password': config.password
		  },
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	};

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {
		let result = {}

		rp(options).then((result, error)=> {
			if (error)  {
				const err = new Error("An error occurred: " + error);
				// depending on whether the Flow editor wants to stop on error or not, either reject a Promise
				// or write the error to the result buffer
				if (args.stopOnError) { reject(err); return; }
				else result = { "error": err.message };
			} else {
				let results = [];
				result.results.forEach((page, i) => {

					//Skip the first 4 entries
					if(i > 3) {
						page.metadata.labels.results.forEach((label)=> {
							
							if(label.name !== "kb-how-to-article" && label.name !== "kb-troubleshooting-article" ) {
								input.actions.addLexiconKeyphrase(args.lexiconId, label.name, [args.lexiconTagName], [], {}); 
								results.push(label.name);
							}
						})
					}
				})
				result = {
					status: {
						message: `Added the following labels with ${args.lexiconTagName}-tag to lexicon ${args.lexiconId}`,
						results
					}
				};
			}
	
			// if not rejected before, write the result buffer to the Context or Input object
			if (args.writeToContext) input.context.getFullContext()[args.store] = result;
			else input.input[args.store] = result;
			resolve(input);	
		})
	});
}

// You have to export the function, otherwise it is not available
module.exports.generateLexicon = generateLexicon;


/**
 * Returns all pages within a specific Confluence Space.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `confluenceSpace` The Space for which a lexicon should be generated
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function getAllPages(input: IFlowInput, args: 
	{ 
		secret: CognigySecret, 
		confluenceSpace: string, 
		writeToContext: boolean, 
		store: string, 
		stopOnError: boolean 
	}): Promise<IFlowInput | {}> {

	// Check if secret exists and contains correct parameters  
	if (!args.secret || !args.secret.password) return Promise.reject("Secret not defined or invalid.");

	// Check if Space is provided
	if (!args.confluenceSpace) return Promise.reject("Please provide a valid Confluence Space (e.g. KNOW)");

	const config = {
		username: args.secret.username,
		password: args.secret.password,
		baseUrl:  args.secret.baseUrl
	};


	let options = {
		uri: `${config.baseUrl}/wiki/rest/api/content?type=page&&spacekey=${args.confluenceSpace}start=0&limit=99999&expand=body.storage`,
		auth: {
			'username': config.username,
			'password': config.password
		},
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	};

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {
		let finalResult;
		rp(options).then((result, error)=> {
			if (error)  {
				const err = new Error("An error occurred: " + error);
				// depending on whether the Flow editor wants to stop on error or not, either reject a Promise
				// or write the error to the result buffer
				if (args.stopOnError) { reject(err); return; }
				else finalResult = { "error": err.message };
			} else {
				let results = [];
				result.results.forEach((page, i) => {
						let cleanPage = {
							id: page.id,
							type: page.type,
							status: page.status,
							title: page.title,
							webLink: `${config.baseUrl}/wiki/spaces/${args.confluenceSpace}/pages/${page.id}`,
							htmlBody: page.body.storage.value
						}

						 results.push(cleanPage);
						})
						finalResult = results;
					}

					

							// if not rejected before, write the result buffer to the Context or Input object
					if (args.writeToContext) input.context.getFullContext()[args.store] = finalResult;
					else input.input[args.store] = finalResult;
					resolve(input);	
				})
			})
	}

// You have to export the function, otherwise it is not available
module.exports.getAllPages = getAllPages;



/**
 * This exposes a search function. Use the 'searchInput' property to query using individual terms or sentences. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `searchInput` The search input. Can be a single word or a string. 
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function searchText(input: IFlowInput, args: 
	{ 
		secret: CognigySecret, 
		searchInput: string, 
		writeToContext: boolean, 
		store: string, 
		stopOnError: boolean 
	}): Promise<IFlowInput | {}> {

	// Check if secret exists and contains correct parameters  
	if (!args.secret || !args.secret.password) return Promise.reject("Secret not defined or invalid.");

	// Check if Search input is provided
	if (!args.searchInput) return Promise.reject("Please provide a valid searchInput");

	const config = {
		username: args.secret.username,
		password: args.secret.password,
		baseUrl:  args.secret.baseUrl
	};

	let options = {
		uri: `${config.baseUrl}/wiki/rest/api/content/search?cql=type=page+and+text~"${args.searchInput}"+order+by+id+asc&expand=body.storage`,
		auth: {
			'username': config.username,
			'password': config.password
		},
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	};

	// Always return a Promise
	// A resolved Promise MUST return the input object
	// A rejected Promise will stop Flow execution and show an error in the UI, but not the channel
	return new Promise((resolve, reject) => {
		let finalResult;
		rp(options).then((result, error)=> {
			if (error)  {
				const err = new Error("An error occurred: " + error);
				// depending on whether the Flow editor wants to stop on error or not, either reject a Promise
				// or write the error to the result buffer
				if (args.stopOnError) { reject(err); return; }
				else finalResult = { "error": err.message };
			} else {
				// if not rejected before, write the result buffer to the Context or Input object
				finalResult = result;
				if (args.writeToContext) input.context.getFullContext()[args.store] = finalResult;
				else input.input[args.store] = finalResult;
				resolve(input);	
			}
		})
	})
}

// You have to export the function, otherwise it is not available
module.exports.searchText = searchText;


