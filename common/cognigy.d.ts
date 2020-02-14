/**
 * THIS FILE CONTAINS THE RELEVANT COGNIGY INTERFACES FOR TYPESCRIPT
 */

/**
 * Flow Input/Output Object
 */
interface IFlowInput {
	input: INLProperties;
	data: any;
	context: IContext;
	profile?: any;
	organisation?: string;
	user?: IUser;
	actions: IActions;
	analyticsdata?: any;
	inputId?: string;
	text?: string;
	emitter?: (event: string, fID: any, args: any) => void;
}

interface IContext {
	maxTopicAge?: number;
	getContext?: (key: string) => any;
	setContext?: (key: string, value: any) => void;
	getFullContext?: () => any;
	delete?: (key: string) => void;
	importContext?: (data: any, replace?: boolean) => void;
}

/**
 * Properties that are returned after the NL Pipeline has run
 */
interface INLProperties extends ICognigyNLPProperties {
	timeReference?: any; // has there been a reference to time? e.g. "next Friday"
	organisation?: string; // id of the organisation
	grammarComponents?: { // contains tokens by grammatical construct
		nouns?: any;
		verbs?: any;
		adjectives?: any;
		adverbs?: any;
	};
	result?: any; // holds slotquestion results
}

interface ICognigyNLPProperties {
	/** The original text of the user */
	text?: string;

	/** The original data of the user */
	data?: {
		[key: string]: any;
	};

	processText?: string;
	keyphraseText?: string;
	synonymText?: string;

	/** The flow parent id, something like "562fa3970685448ac241fa1f8978e496" */
	flowParentId?: string;

	/** The type of the sentence */
	type?: "Statement" | "whQuestion" | "ynQuestion" | "howQuestion" | "pAnswer" | "nAnswer" | "Greeting" | "BGreeting" | string;

	/** The slots matched witin the text of the user */
	slots?: ICognigyNLPSlots;

	/** The current state */
	state?: string;

	/** The userId of the user */
	userId?: string;

	/** The current id of this session, something like "2c44d1d3-98a4-469e-91c4-186298e22e5b" */
	sessionId?: string;

	/** Unique id of this input, something like "20ec9ed0-6f8e-4bfa-82fb-28f58be57035" */
	inputId?: string;

	/** URL Token of the Endpoint */
	URLToken: string;

	/** Token tree from NLP service */
	tokens?: any;

	/** The name of the intent that was found */
	intent?: string;

	/** The score of the intent in case an intent was found */
	intentScore?: number;

	/** The name of the intent that was found but that is only allowed within a different state */
	intentOutOfState?: string;

	/** What is the stencen to clarify? */
	intentClarification?: string;

	/** The full results of our intent mapper */
	intentMapperResults?: any;

	/** The parent id of the flow that contains the winning intent, something like "6d200e6e7a6fa4549308b44b20f5217e" */
	intentFlow?: string;

	/** An object containing the current time in a fine-granular fashion */
	currentTime?: ICognigyNLPCurrentTime;

	/** The mode of this input */
	mode?: "TextOnly" | "DataOnly" | "TextData" | "Empty";

	/** The furstation index of the user, larger than 1 */
	frustration?: number;

	/** Holds an array of noun components */
	nounComponents?: any;

	question?: ICognigyNLPPropertiesQuestion;

	subject?: ICognigyNLPPropertiesSubject;

	relation?: ICognigyNLPPropertiesRelation;

	object?: ICognigyNLPPropertiesObject;

	/** The users channel */
	channel?: "adminconsole" | "facebook" | "alexa" | "google" | "twilio" | "line" | string;

	/** If an attached flow was executed, store the parent id here */
	executedAttachedFlow?: string;

	/** Was an intent or keyphrase found? */
	foundKeyphraseOrIntent?: boolean;

	/** Array of completed goals in this session */
	completedGoals?: string[];

	/** The number of executions */
	execution?: number;

	/** Was an intent or keyphrase found? */
	understood?: boolean;

	/**
	 * DEPRECATED!!!!
	 */
	currentState?: string; // the current state of the flow -- DEPRECATED, use state instead
	keyphrases?: any; // list of identified keyphrases (not set in this scope, but outside)
	numbers?: any; // collection of numbers
	granularIntention?: string; // old intent classifier
	granularIntentionFlow?: string;
	granularIntentionFiltered?: boolean; // was the found intent found in a filtered out state?
	timeReference?: any; // has there been a reference to time? e.g. "next Friday"
	parsedTime?: any; // contains identified hours and minutes
}

type ICognigyNLPSlots = {
	/** Dates found in the text of the user */
	DATE?: INLPDateSlot[] | null;

	/** Numbers found in the text of the user */
	NUMBER?: number[] | null;

	/** Durations found in the text of the user */
	DURATION?: INLPDurationSlot | null;

	/** Temperate(s) found in the text of the user */
	TEMPERATURE?: number[] | null;

	/** Contains found age */
	AGE?: number[] | null;

	/** Contains all found and valid emails */
	EMAIL?: string[] | null;
} & ICognigyKeyphrases;

interface ICognigyNLPCurrentTime {
	day?: number;
	dayOfWeek?: string; // "Thursday"
	hour?: number;
	ISODate?: string;
	milliseconds?: number;
	minute?: number;
	month?: number;
	second?: number;
	timezoneOffset?: string; // "Arctic/Longyearbyen"
	weekday?: number;
	year?: number;
}

interface ICognigyNLPPropertiesQuestion {
	/** Is this sentence a question */
	exists: boolean;

	/** What is the question word */
	word?: string;

	/** What is the question type */
	type?: "WH" | "YN";

	/** What is the expected answer class? */
	class?: string;

	/** Attributes of the question */
	attributes?: any;

	/** If the question was already answered or not */
	answered?: boolean;
}

interface ICognigyNLPPropertiesSubject {
	/** Text of the subject */
	text: string;

	/** The lemma of the subject */
	lemma?: string;

	/** Does subject have a possesive and if yes, what is it? */
	POSS?: any;

	/** Chained possessive elements (my father's uncle's car) */
	possessive_chain?: string[];

	/** nlp tokens */
	token?: any;

	/** Entity type of the subject (e.g. Person) */
	type?: any;

	/** Pos tag */
	POS?: string;

	/** Reference to another subject */
	PREP?: any;

	/** Nlp helper object */
	components?: any;

	/** identified numeric modifier */
	number?: number;

	/** If the subject has been changed, store original values here */
	original?: {};

	/** The morphology of the subject */
	morphology?: "singular" | "plural";
}

interface ICognigyNLPPropertiesRelation {
	/** Text of the relation */
	text: string;

	/** The lemma of the relation */
	lemma: string;

	/** Is the realtion negative? (e.g. I don't eat cake) */
	neg: boolean;

	/** nlp tokens */
	token?: any;

	/** POst tag */
	POS?: string;

	/** Reference to another subject */
	PREP?: any;

	/** Needs documentation */
	ACOMP?: any;

	/** Attributes of the relation */
	attributes?: any;

	/** Optional reference object to signal not that the relation root, but one of its components is refering to the object (e.g. "from") */
	objref?: any;

	/** Nlp helper object */
	components?: any;

	/** text of the relation with [NEG] appended if it is negative */
	fulltext?: string;
}

interface ICognigyNLPPropertiesObject {
	/** The text of the object */
	text: string;

	/** The lemma of the object */
	lemma: string;

	/** Does object have a posessive and if yes, what is it? */
	POSS?: any;

	/** Chained possessive elements (my father's uncle's car) */
	possessive_chain?: any;

	/** nlp tokens */
	token?: any;

	/** POS tag */
	POS?: string;

	/** Entity type of the object (e.g. Person) */
	type?: any;

	/** nlp helper object */
	components?: any;

	/** Identified numeric modifier */
	number?: number;

	/** If the subject has been changed, stored original values here */
	original?: {};

	/** The morphology of the subject */
	morphology?: "singular" | "plural";
}

/**
 * The date slot
 */
interface INLPDateSlot {
	start?: {
		day: number;
		hour: number;
		meridiem: number;
		millisecond: number;
		minute: number;
		month: number;
		second: number;
		weekday: number;
		dayOfWeek: string;
		year: number;
	} | null;
	end?: {
		day: number;
		hour: number;
		meridiem: number;
		millisecond: number;
		minute: number;
		month: number;
		second: number;
		weekday: number;
		dayOfWeek: string;
		year: number;
	} | null;
}

/**
 * The duration slot
 */
interface INLPDurationSlot {
	hour?: number;
	minute?: number;
	second?: number;
}

/**
 * Cognigy keyphrases
 */
interface ICognigyKeyphrases {
	[key: string]: IMatchedKeyphrase[];
}

interface IMatchedKeyphrase {
	keyphrase: string;
	synonym: string;
	lower: string; // can we remove it?
	count?: number;
	neg?: boolean;
	data?: object;
}

interface IActions {
	output?: (text: string, data: any) => void;
	say?: (text: string, data: any) => void;
	think?: (text: string, data: any, id: string) => void;
	addToContext?: (key: string, value: any, mode: string) => void;
	updateProfile?: (key: string, value: any) => Promise<any>;
	deactivateProfile?: () => Promise<any>;
	activateProfile?: () => Promise<any>;
	mergeProfile?: (contactId: string) => Promise<any>;
	removeFromContext?: (key: string, value: string, mode: string) => void;
	getContext?: (key: string) => any;
	setState?: (state: string) => void;
	getState?: () => string;
	deleteContext?: (key: string) => void;
	log?: (level: string, text: string) => void;
	resetContext?: () => Promise<object>;
	resetState?: () => Promise<string>;
	completeGoal?: (key: string) => void;
	addLexiconKeyphrase?: (lexicon: string, keyphrase: string, tags: Array<string>, synonyms: Array<string>, data?: Object) => void;
	setKeyphrase?: (keyphrase: string, tags: string[], synoyms: string[]) => void;
	setTimezoneOffset?: (offset: number | string) => void;
	parseCognigyScript?: (text: string, condition?: boolean) => string;
}

interface IUser {
	userId: string;
	type: string;
	channel: string;
	organisation: string;
	sessionId?: string;
	ip?: string;
}

interface CognigySecret {
	[key: string]: string
}