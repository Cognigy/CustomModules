import { patternMatcher } from './lib/patternMatcher';
/**
 * Finds compound slots using pattern inside the user input
 * @arg {CognigyScriptArray} `patterns` The patterns to check for
 * @arg {CognigyScript} `compoundGroupName` Name for the compound group
 * @arg {CognigyScript} `alternateInput` Input text to use instead of input text
 * @arg {Boolean} `detailedCompoundSlots` Store detailed results for compound slots
 * @arg {Boolean} `createNewSlots` Create new slots from tags
 * @arg {Boolean} `tagExistingSlots` Tag existing slots
 */
async function matchPattern(input: IFlowInput, args: { patterns: string[], compoundGroupName: string, alternateInput: string, detailedCompoundSlots: boolean, createNewSlots: boolean, tagExistingSlots: boolean }): Promise<IFlowInput | {}> {
	const { patterns, compoundGroupName, detailedCompoundSlots, tagExistingSlots, createNewSlots, alternateInput } = args;

	const result = patternMatcher(input.input, patterns, compoundGroupName, detailedCompoundSlots, tagExistingSlots, createNewSlots, alternateInput);
	input.input = result;

	return input;
}

module.exports.matchPattern = matchPattern;