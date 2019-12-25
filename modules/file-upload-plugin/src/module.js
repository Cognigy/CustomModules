
/**
 * Prompts a webchat user to upload something to an S3 Bucket
 * @arg {SecretSelect} `secret` a secret with an AWS users access_key_id and secret_access_key
 * @arg {Select[v3,v4]} `signatureVersion` the signature version you want to use. (default v4) 
 * @arg {CognigyScript} `region` the endpoint region (default eu-central-1)
 * @arg {CognigyScript} `bucket` the name of the bucket (default bucket-name)
 * @arg {CognigyScript} `key` name of the bucket key (default uploaded-file)
 */
async function uploadToAWSBucket(cognigy, {
    secret,
    signatureVersion = 'v4',
    region = 'eu-central-1',
    bucket = 'bucket-name',
    key = 'uploaded-file'
}) {
    if (!secret)
        throw new Error('secret is not defined')

    const { access_key_id, secret_access_key } = secret;

    if (!access_key_id)
        throw new Error('access_key_id is not defined in selected secret');

    if (!secret_access_key)
        throw new Error('secret_access_key is not defined in selected secret');

    const S3 = require('aws-sdk/clients/s3');
    const s3Client = new S3();

    s3Client.config.update({
        accessKeyId: access_key_id,
        secretAccessKey: secret_access_key,
        signatureVersion,
        region
    });

    const uploadUrl = s3Client.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: key
    });

    const downloadUrl = s3Client.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key
    });

    cognigy.actions.output('', {
        _plugin: {
            type: 'file-upload',
            service: 'amazon-s3',
            uploadUrl,
            downloadUrl
        }
    });

    return cognigy;
}

/**Upload to Azure module */

/**
 * Prompts a webchat user to upload something to a Azure blob container
 * @arg {String} `accountStorageName` The name of the Azure Storage account that will be use to upload the file.
 * @arg {CognigyScript} `containerName` The name of the container, if the name is not given, a random generated id will be used as name. Only lowercase and numbers are accepted.
 * @arg {SecretSelect} `secret` The secret access key from  an Azure user's account. Please name the "key" value of the secret "secret_access_key".
 * @arg {Number} `Timeout` The time in minutes that the upload Url used by the Webchat will be availabe, maximum 60 min. ( default 5 min. ).
 */
async function uploadToAzureContainer(cognigy, {
    secret,
    accountStorageName,
    containerName,
    Timeout
}) {


    const {
        Aborter,
        generateBlobSASQueryParameters,
        SASProtocol,
        ContainerSASPermissions,
        ServiceURL,
        SharedKeyCredential,
        StorageURL,
        ContainerURL,
    } = require('@azure/storage-blob');
    
    const uuidv1 = require('uuid/v1');

    if (!containerName) {
        containerName = uuidv1();
    }

    const { secret_access_key } = secret;

    /**Create Azure blob service object */
    function getBlobServiceUrl() {
        const credentials = new SharedKeyCredential(
            accountStorageName,
            secret_access_key
        );
        const pipeline = StorageURL.newPipeline(credentials);
        const blobPrimaryURL = `https://${accountStorageName}.blob.core.windows.net/`;
        return new ServiceURL(blobPrimaryURL, pipeline);
    }

    const serviceURL = getBlobServiceUrl();


    /**Create a new container from the given name, if name was not given, the container name will be the date it was created */


    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

    async function createContainer() {
        try {

            await containerURL.create(Aborter.none);

        } catch (error) {
            return error;
        }
    }

    await createContainer();

    /**SasURL Expiration time */

    const start = new Date();

    const end = new Date();

    let timeOut = 5;

    if( Timeout && Timeout <= 60 ) {
        timeOut = Timeout;
    }

    end.setMinutes(end.getMinutes() + timeOut);
    
    // By default, credential is always the last element of pipeline factories
    const factories = serviceURL.pipeline.factories;
    const sharedKeyCredential = factories[factories.length - 1];

  /**Create a sasToken */

  const containerSAS = generateBlobSASQueryParameters({
    containerName, // Required
    permissions: ContainerSASPermissions.parse("racwdl").toString(), // Required
    startTime: start, // Required
    expiryTime: end, // Optional. Date type
    ipRange: { start: "0.0.0.0", end: "255.255.255.255" }, // Optional
    protocol: SASProtocol.HTTPSandHTTP, // Optional
    version: "2016-05-31" // Optional
     },
     sharedKeyCredential
   ).toString();

    const baseURL = serviceURL.url;
    const sasSignature = `?${containerSAS}`

    cognigy.actions.output('', {
        _plugin: {
            type: 'file-upload',
            service: 'azure',
            baseURL,
            sasSignature,
            containerName,
        }
    });

    return cognigy;
}

module.exports = {
    uploadToAWSBucket,
    uploadToAzureContainer
}