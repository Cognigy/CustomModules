/**
 * Sends a message to an AudioCodes caller
 * @arg {CognigyScript} `text` The message text to send
 * @arg {JSON} `activityParams` Options activity parameters to send
 */
async function sendMessage(input: IFlowInput, args: { text: string, activityParams: any }): Promise<IFlowInput | {}> {
	if (args.text) input.actions.output(args.text, {
		"_cognigy": {
			"_audiocodes": {
				"activities": [
					{
						"type": "message",
						"text": args.text,
						"activityParams": args.activityParams
					  }					  
				]
			}
		}
	});

	return input;
}

/**
 * Sets session parameters
 * @arg {JSON} `sessionParams` Options activity parameters to send
 */
async function setSessionParams(input: IFlowInput, args: { sessionParams: any }): Promise<IFlowInput | {}> {
	if (args.sessionParams) input.actions.output(null, {
		"_cognigy": {
			"_audiocodes": {
				"activities": [
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
				"activities": [
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
	if (args.transferTarget && args.handoverReason)
		input.actions.output(null, {
			"_cognigy": {
				"_audiocodes": {
					"activities": [
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
 * @arg {CognigyScript} `playUrl` The target to transfer to
 * @arg {CognigyScript} `playUrlMediaFormat` The reasons for handing over
 */
async function playURL(input: IFlowInput, args: { playUrl: string, playUrlMediaFormat: string }): Promise<IFlowInput | {}> {
	if (args.playUrl && args.playUrlMediaFormat)
		input.actions.output(null, {
			"_cognigy": {
				"_audiocodes": {
					"activities": [
						{
							"type": "event",
							"name": "playUrl",
							"activityParams": {
							"playUrlUrl": args.playUrl,
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