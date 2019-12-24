
/**
 * Sends a message to an AudioCodes caller
 * @arg {CognigyScript} `text` The message text to send
 * @arg {JSON} 'activityParams' Options activity parameters to send
 */
async function sendMessage(input: IFlowInput, args: { text: string, activityParams: any }): Promise<IFlowInput | {}> {
	input.actions.output(args.text, null);
	if (args.activityParams) input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activityParams": args.activityParams
			}
		}
	});

	return input;
}

/**
 * Sets session parameters
 * @arg {JSON} 'sessionParams' Options activity parameters to send
 */
async function setSessionParams(input: IFlowInput, args: { sessionParams: any }): Promise<IFlowInput | {}> {
	if (args.sessionParams) input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activites": [
					{
						"type": "event",
						"name": "config",
						"sessionParams": args.sessionParams
					  }					  
				]
			}
		}
	});

	return input;
}

/**
 * Hangs up a call
 * @arg {CognigyScript} `hangupReason` The reasons for hanging up
 */
async function hangup(input: IFlowInput, args: { hangupReason: string }): Promise<IFlowInput | {}> {
	input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activites": [
					{
						"type": "event",
						"name": "hangup",
						"activityParams": {
						  "hangupReason": args.hangupReason
						}
					  }					  
				]
			}
		}
	});

	return input;
}

/**
 * Hands a call to another number
 * @arg {CognigyScript} `transferTarget` The target to transfer to
 * @arg {CognigyScript} `handoverReason` The reasons for handing over
 */
async function handover(input: IFlowInput, args: { transferTarget: string, handoverReason: string }): Promise<IFlowInput | {}> {
	input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activites": [
					{
						"type": "event",
						"name": "handover",
						"activityParams": {
						  "transferTarget": args.transferTarget,
						  "handoverReason": args.handoverReason
						}
					  }					  
				]
			}
		}
	});

	return input;
}

/**
 * Play audio to the user
 * @arg {CognigyScript} `playUrlUrl` The target to transfer to
 * @arg {CognigyScript} `playUrlMediaFormat` The reasons for handing over
 */
async function playURL(input: IFlowInput, args: { playUrlUrl: string, playUrlMediaFormat: string }): Promise<IFlowInput | {}> {
	input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activites": [
					{
						"type": "event",
						"name": "handover",
						"activityParams": {
						  "playUrlUrl": args.playUrlUrl,
						  "playUrlMediaFormat": args.playUrlMediaFormat
						}
					  }					  
				]
			}
		}
	});

	return input;
}


module.exports.sendMessage = sendMessage;
module.exports.setSessionParams = setSessionParams;
module.exports.hangup = hangup;
module.exports.handover = handover;
module.exports.playURL = playURL;