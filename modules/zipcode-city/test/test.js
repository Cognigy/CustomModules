const mod = require("../build/module");

const input = {
	input: {
		"zipcode_germany": [
			{
				"keyphrase": "98646"
			}
		]
	},
	context: {
		setContext: (key, value) => { input.context[key] = value; return input.context }
	}
}

const args = {
	"writeToContext": false,
	"store": "teststore",
};

(async () => {
	try {
		let result = await mod.zipcodeToCity(input, args);
		console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})();
