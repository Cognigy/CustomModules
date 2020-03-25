const mod = require("../build/module");

const input = {
	input: {},
	context: {
		getFullContext: () => input.context
	}
}

const secret = {
	token: "token"
};

const args = {
	"arg1": "test",
	"arg2": "option1",
	"arg3": 2,
	"writeToContext": false,
	"store": "teststore",
	"secret": secret
};

(async () => {
	try {
		let result = await mod.function1(input, args);
		console.log(JSON.stringify(result, undefined, 4));
	} catch (err) {
		console.log(err);
	}
})();