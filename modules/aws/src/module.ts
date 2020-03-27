// Load the SDK
const AWS = require('aws-sdk');

/**
 * Say something with AWS Polly.
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `text` The text that is said by Polly
 * @arg {Select[Kimberly,Salli,Joey,Marlene,Hans,Vicki]} `voice` The voice polly shell use
 * @arg {CognigyScript} `contextStore` The context store key
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
function sayPolly(input: any, args: { secret: CognigySecret, text: string, voice: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    const { secret, text, voice, contextStore, stopOnError } = args;
    const { accessKeyId, secretAccessKey, region } = secret;

    if (!secret) throw new Error('Secret not defined.');
    if (!contextStore) throw new Error('Context store is missing.');
    if (!voice) throw new Error('Please select a voice for polly.');
    if (!text) throw new Error('The text is missing. Please define what Polly should say.');
    if (!accessKeyId) throw new Error("The secret is missing the 'accesskeyId' field");
    if (!secretAccessKey) throw new Error("The secret is missing the 'secretAccessKey' field.");
    if (!region) throw new Error("The secret is missing the 'region' field.");

    AWS.config.accessKeyId = accessKeyId;
    AWS.config.secretAccessKey = secretAccessKey;

    // Create an Polly client
    const presigner = new AWS.Polly.Presigner({
        signatureVersion: 'v4',
        region
    });

    const params = {
        OutputFormat: "mp3",
        SampleRate: "8000",
        Text: text,
        TextType: "text",
        VoiceId: voice,
    };

    // get the polly mp3 file url
    let url = presigner.getSynthesizeSpeechUrl(params, 3600);

    // send command to webchat to play polly
    input.actions.output('', {
        read: true,
        url
    });


    return input;
}

module.exports.sayPolly = sayPolly;