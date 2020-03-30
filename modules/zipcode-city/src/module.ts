/**
 * Reads zipcode_germany out from keyphrases and if any returns {city: CITY_NAME, city_addon: CITY_NAME_ADDON, state: STATE_NAME}
 * @arg {Boolean} `writeToContext` Whether to write to Cognigy Context (true) or Input (false)
 * @arg {CognigyScript} `store` Where to store the result
 */
async function zipcodeToCity(
  input: IFlowInput,
  args: {
    writeToContext: boolean;
    store: string;
  }
): Promise<IFlowInput> {
  return new Promise(resolve => {
		let result = {};
    if (input.input?.keyphrases?.zipcode_germany) {
      const data = require("./data.de.json");
      const zipcode = input.input.keyphrases.zipcode_germany[0].keyphrase;
      const city = data.find(city => String(city.Plz) === String(zipcode));
			if (city) {
				result = {
					city: city.Ort,
					city_addon: city.Zusatz,
					state: city.Bundesland
				};
				if (args.writeToContext) {
					input.context.setContext(args.store, result);
				} else {
					input.input[args.store] = result;
				}
			}
    }

    resolve(input);
  });
}

module.exports.zipcodeToCity = zipcodeToCity;
