

/**
 * Use the Cognigy Datepicker
 * @arg {CognigyScript} `eventName` The event for the date
 * @arg {CognigyScript} `minDate` The minimum date the user can choose
 * @arg {CognigyScript} `maxDate` The maximum date the user can choose
 * @arg {Boolean} `disableRange` If you want to disable a range in the next option
 * @arg {CognigyScriptArray} `disable` The dates to disable. If disableRange is true, give two dates, the from and the to date
 * @arg {Boolean} `enableTime` If you want the user to pick the time
 * @arg {Select[single,multiple,range]} `mode` If the user can choose one or more dates
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function datepicker(input: IFlowInput, args: { eventName: string, minDate: Date, maxDate: Date, disableRange: boolean, disable: [], enableTime: boolean, mode: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

	// check if necessary arguments are present
    if (!args.eventName) return Promise.reject("Event not provided.");
    if (args.minDate instanceof Date !== true)  return Promise.reject("MinDate has to be a Date");
    if (args.maxDate instanceof Date !== true)  return Promise.reject("MaxDate has to be a Date");

	// Always return a Promise
	return new Promise((resolve, reject) => {
		let result = {}

		
	});
}

module.exports.datepicker = datepicker;

