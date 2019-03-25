/**
 * Opens the Cognigy Fileuploader Plugin
 * @arg {CognigyScript} `endpoint` The POST endpoint to upload the file
 * @arg {CognigyScript} `buttonText` The text of the upload button
 */
async function fileUploader(input: IFlowInput, args: { endpoint: string, buttonText: string }) {
    // Check if secret exists and contains correct parameters
    if (!args.endpoint) return Promise.reject("No endpoint defined.");
    if (!args.buttonText) return Promise.reject("No upload button text defined.");

    // send the message to open datepicker
    input.actions.output("", {
        _plugin: {
            type: "file-uploader",
            data: {
                endpoint: args.endpoint,
                uploadButtonText: args.buttonText
                
            }
        }
    });
}

module.exports.fileUploader = fileUploader;
