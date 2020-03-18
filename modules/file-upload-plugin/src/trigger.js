const { uploadToAWSBucket, uploadToAzureContainer } = require('./module');
 
const cognigyMock = {
    actions: {
        output: console.log.bind(console)
    }
}

uploadToAWSBucket(cognigyMock, {
    json: ''
});

uploadToAzureContainer(cognigyMock, {
    json: ''
});

