/**
 * Opens the Cognigy Fileuploader Plugin
 * @arg {CognigyScript} `endpoint` The POST endpoint to upload the file
 * @arg {CognigyScript} `uploadButtonText` The text of the upload button
 */
function uploadFile(input: IFlowInput, args: { endpoint: string, uploadButtonText: string }): void {

    const { endpoint, uploadButtonText } = args;
    // Check if secret exists and contains correct parameters
    if (!endpoint) throw new Error('No endpoint defined.');
    if (!uploadButtonText) throw new Error('No upload button text defined.');

    // send the message to open datepicker
    input.actions.output("", {
        _plugin: {
            type: "file-uploader",
            data: {
                endpoint,
                uploadButtonText
            }
        }
    });
}

module.exports.uploadFile = uploadFile;
