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

	// firstly sort array to start with the longest patterns, as those will win
	patterns.sort((a, b) => {
		return b.length - a.length;
	});

	// we use let because we strip out found phrases later
	let inputText = alternateInput || input.input.text;

	const regexPatterns = [];

	// go through patterns and create regex versions of each
	patterns.forEach((pattern) => {
		// set parsedPattern to pattern in case there are no slots
		let parsedPattern = pattern;

		// match all mentioned slots in the pattern
		const foundSlots = pattern.match(/\@[\w>]+/g);
		const tags = [];
		const slots = [];

		// if there are slots, process them
		if (foundSlots.length > 0) {
			foundSlots.forEach((slot) => {
				// splits tags from slots
				const split = slot.split(">");
				const slotName = split[0].replace("@", "");
				slots.push(slotName);

				// if there is a tag (SLOT>TAG), remember it
				if (split.length === 2) tags.push(split[1]);
				else tags.push("");

				const slotValues = [];
				if (input.input.slots[slotName]) {
					switch (slotName) {
						case "NUMBER": 
							input.input.slots[slotName].forEach((s) => {
								// it's important to use the synonym, as this is the text that was actually found
								slotValues.push(s);
							});
							break;
						default:
							input.input.slots[slotName].forEach((s) => {
								// it's important to use the synonym, as this is the text that was actually found
								slotValues.push(s.synonym);
							});
					}
					
					const slotRegex = slotValues.join("|");
					// replace the slots name with the list of actually found entites for this slot
					parsedPattern = parsedPattern.replace(new RegExp(`${slot}`, "g"), `(${slotRegex})`);
				}
			});
		};
		regexPatterns.push({
			"pattern": pattern,
			"parsedPattern": parsedPattern,
			"tags": tags,
			"slots": slots
		});
	});

	const compoundGroups = [];

	// go through all created patterns and test them
	regexPatterns.forEach((pattern) => {
		let result;
		const regExp = new RegExp(pattern.parsedPattern, "g");
		const regexMatches = [];
		while (result = regExp.exec(inputText)) {
			regexMatches.push(result);
			inputText = inputText.replace(result[0], "");
		}

		if (regexMatches.length > 0) {
			// we found a match for this pattern!
			regexMatches.forEach((matches, mi) => {
				// set up a compoundGroup scaffold, just in case we need it
				const compoundGroup = {
					"matchedPhrase": matches[0],
					"components": []
				};

				if (!detailedCompoundSlots) delete compoundGroup.components;

				// iterate through matches, starting at the first group result ([0] is the full match)
				for (let i = 1; i < matches.length; i++) {
					const originalSlot = input.input.slots[pattern.slots[i-1]].find(e => (e.synonym) ? e.synonym === matches[i] : e);

					// create compound groups
					if (detailedCompoundSlots) {
						const components = {
							"slot": pattern.slots[i-1],
							"value": originalSlot.keyphrase || originalSlot
						};
						if (pattern.tags[i-1]) components["tag"] = pattern.tags[i-1];
						else components["tag"] = null;
						
						compoundGroup.components.push(components);
					} else {
						if (pattern.tags[i-1]) compoundGroup[pattern.tags[i-1]] = originalSlot.keyphrase || originalSlot;
						else compoundGroup[pattern.slots[i-1]] = originalSlot.keyphrase || originalSlot;
					}

					if (pattern.tags[i-1]) {
						if (createNewSlots) {
							if (input.input.slots[pattern.tags[i-1]]) {
								input.input.slots[pattern.tags[i-1]].push(originalSlot);
							} else input.input.slots[pattern.tags[i-1]] = [originalSlot];
						} 

						if (tagExistingSlots) {
							input.input.slots[pattern.slots[i-1]].forEach((s) => {
								if (s.synonym && s.synonym === matches[i])
									s["tags"] = (Array.isArray(s["tags"])) ? s["tags"].push(pattern.tags[i-1]) : [pattern.tags[i-1]];
							});
						}
					}
				}
				compoundGroups.push(compoundGroup);
			});
		}
	});

	if (!input.input["compoundSlots"]) input.input["compoundSlots"] = {};
	input.input["compoundSlots"][compoundGroupName] = compoundGroups;    

	return input;
}

module.exports.matchPattern = matchPattern;