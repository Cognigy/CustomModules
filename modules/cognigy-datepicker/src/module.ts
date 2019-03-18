/**
 * Use the Cognigy Datepicker
 * @arg {CognigyScript} `eventName` The event for the date
 * @arg {Select[ar,at,az,be,bg,bn,catcs,cy,da,de,en,eo,es,et,fa,fi,fo,fr,gr,he,hi,hr,hu,id,is,it,ja,ko,km,kz,lt,lv,mk,mn,ms,my,nl,no,pa,pl,pt,ro,ru,si,sk,sl,sq,sr,sv,th,tr,uk,vn,zh]} `language` The language of the datepicker
 * @arg {CognigyScript} `minDate` The minimum date the user can choose
 * @arg {CognigyScript} `maxDate` The maximum date the user can choose
 * @arg {Boolean} `disableRange` If you want to disable a range in the next option
 * @arg {CognigyScriptArray} `disable` The dates to disable. If disableRange is true, give two dates, the from and the to date
 * @arg {Boolean} `enableTime` If you want the user to pick the time
 * @arg {Select[single,multiple,range]} `mode` If the user can choose one or more dates
 */
async function datepicker(input: IFlowInput, args: { eventName: string, language: string, minDate: string, maxDate: string, disableRange: boolean, disable: [], enableTime: boolean, mode: string, stopOnError: boolean }) {
	// check if necessary arguments are present
	if (!args.eventName) return Promise.reject("Event not provided.");

	// send the message to open datepicker
	input.actions.output("", {
		_plugin: {
			type: "date-picker",
			data: {
				eventName: args.eventName,
				locale: args.language,
				enableTime: args.enableTime,
				mode: args.mode,
				disable: getDisabledDates(args.disableRange, args.disable),
				minDate: args.minDate,
				maxDate: args.maxDate
			}
		}
	});
}

const getDisabledDates = (disableRange, disable) => {
	if (disableRange) {
		return [
			{
				from: disable[0],
				to: disable[1]
			}
		]
	}
	return disable
};

module.exports.datepicker = datepicker;