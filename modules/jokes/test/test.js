const mod = require("../build/module");

const secret = { apiKey: process.env.HUBSPOT_APIKEY };
const context = {
	getFullContext: () => context
};

(async () => {
	try {
		const dater = Date.now() + 10000000;
		const data = {
			"engagement": {
				"active": true,
				"type": "TASK",
				"timestamp": dater,
				"ownerId": 18239497
			},
			"associations": {
				"contactIds": [761851],
				"companyIds": [],
				"dealIds": [],
				"ownerIds": [18239497]
			},
			"metadata": {
				"body": "Call Sascha Wolter.",
				"subject": "Wolter Tasl",
				"status": "NOT_STARTED",
				"forObjectType": "CONTACT",
				"reminders": [
					dater
				]
			}
		};

		let result = await mod.findCompanyByDomain({ "input": {}, "context": context }, { "domain": "cognddigy.com", "properties": "properties", "writeToContext": true, "store": "hubspot", "secret": secret, "stopOnError": false });
		console.log(JSON.stringify(result, undefined, 4));

		// let result = await mod.createEngagement({ "input": {} }, { "data": data, "properties": "properties", "writeToContext": false, "store": "hubspot" });
		// console.log(JSON.stringify(result, undefined, 4));

		// let result = await mod.getOwners({ "input": {} }, { "data": data, "properties": "properties", "writeToContext": false, "store": "hubspot" });
		// console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log("ERROR: " + err);
	}
})();