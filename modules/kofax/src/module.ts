import axios from 'axios';

// handle self signed certicates and ignore them
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Runs a robot
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {JSON} `body` The data body for POST request
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function RPARunRobotAsync(input: IFlowInput, args: { secret: CognigySecret, robot: string, project: string, body: JSON, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // a.teusz@cognigy.com

    const { secret, body, contextStore, stopOnError } = args;
    const { api_key } = secret;
    // Check if secret exists and contains correct parameters
    if (!secret) throw new Error('Not secret defined.');
    if (!body) throw new Error('No JSON body defined.');

    // Check if the secret is given
    if (!api_key) throw new Error("The secret is missing the 'api_key' field.");

    try {
        const response = await axios.post(`https://request-forwarder.cognigy.ai/forward`, body, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            }
        });

        input.actions.addToContext(contextStore, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.RPARunRobotAsync = RPARunRobotAsync;


/**
 * Runs a Kofax RPA robot and waits up to 20 seconds for the answer
 * @arg {SecretSelect} `secret` please enter here your Kofax RPA login credentials, or leave it empty if you have no authentifcation.
 * @arg {CognigyScript} `rpaServer` The url of the RPA server. e.g. http://localhost:50080 or http://roboserver:8080/ManagementConsole
 * @arg {CognigyScript} `project` The project of the RPA robot. The Default project is called 'Default project'
 * @arg {CognigyScript} `robot` The RPA robot without extenstion. e.g. Robot instead of Robot.robot
 * @arg {CognigyScript} `variable` The variable type of the robot input. This robot may only have one attribute on the input variable.
 * @arg {Select[text,integer,number,boolean,binary]} `attributeType` the attribute type of the robot . 'text', 'integer', 'number', 'boolean' or 'binary'
 * @arg {CognigyScript} `attribute` the attribute name of the input variable
 * @arg {CognigyScript} `value` the value of the input variable.
 * @arg {CognigyScript} `result` the name of the attribute you want to return. This connector only returns 1 attribute from the first result of the robot. If you want all results from the robot, then leave this field empty
 * @arg {CognigyScript} `contextStore` Where to store the results from the Robot
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function RPARunRobot(input: IFlowInput, args: { secret: CognigySecret, rpaServer: string, project: string, robot: string, variable: string, attributeType: string, attribute: string, value: string, result: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // david.wright@kofax.com

    const { secret, rpaServer, project, robot, variable, attributeType, attribute, value, result, contextStore, stopOnError } = args;
    const { username, password } = secret;

    // Check if the secret is given
    if (!rpaServer) throw new Error("The RPA robot url is missing. eg http://roboserver:50080 or http://roboserver:8080/ManagementConsole/");
    if (!project) throw new Error("The RPA robot project is missing. The Default project is called 'Default project'");
    if (!robot) throw new Error("The RPA robot name is missing (don't include .robot)");
    if (!variable) throw new Error("The RPA robot requires an input type with a single attribute.");
    if (!attributeType) throw new Error("The input attribute type is missing. 'integer', 'number','boolean', 'binary' for binary, pdf or image, 'text' for longtext,shorttext,xml,json,or HTML");

    const at = attributeType.toLowerCase();

    if (!(at === 'integer' || at === 'boolean' || at === 'binary' || at === 'text' || at === 'number' )) throw new Error("The input attribute type  is incorrect. 'integer', 'number','boolean', 'binary' for binary, pdf or image, 'text' for longtext,shorttext,xml,json,or HTML");
    if (!attribute) throw new Error("The input attribute name is missing");
    if (!value) throw new Error("The input parameter is missing");
    if (!contextStore) throw new Error("you must provide a name for the context store");
    const data = { "parameters": [{ "variableName": variable, "attribute": [{ "type": at, "name": attribute, "value": value }] }] };

    // Create the post url for the Kofax RPA REST Service
    const robotname = robot.replace(".robot", "");
    const url = `${rpaServer}/rest/run/${project}/${robotname}.robot`;

    try {
        let response;
        if (username !== "") {
             response = await axios({
                method: "post",
                url,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                auth: {
                    username,
                    password
                },
                data
            });
        } else {
            response = await axios({
                method: "post",
                url,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                data
            });
        }
        console.log(JSON.stringify(response.data));
        // After webcall
        let output = response;  // return the entire JSON response from Kofax RPA, unless the result parameter matches an output attribute from the robot
        if (response.data.values.length > 0) {
            for (const attribute of response.data.values[0].attribute) {
                if (attribute.name === result) {
                    output = attribute.value;
                }
            }
        }

        input.actions.addToContext(contextStore, output, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.RPARunRobot = RPARunRobot;


/**
 * Takes the user's data and creates a Word document, which is retuned as Base64 string
 * @arg {CognigyScript} `url` The API post url
 * @arg {CognigyScript} `firstName` The user's first name
 * @arg {CognigyScript} `middleName` The user's middle name
 * @arg {CognigyScript} `lastName` The user's last name
 * @arg {CognigyScript} `birthday` The user's birthday
 * @arg {CognigyScript} `email` The user's email address
 * @arg {CognigyScript} `phoneNumber` The user's phone number
 * @arg {CognigyScript} `nationality` The user's nationality
 * @arg {CognigyScript} `address` The user's address
 * @arg {Select[Single account, Joint account]} `accountType` The account type of the requested document
 * @arg {CognigyScript} `monthlyIncome` The user's monthly income
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function KCMgetDoc(input: IFlowInput, args: {
    url: string,
    firstName: string,
    lastName: string,
    middleName: string,
    birthday: string,
    email: string,
    phoneNumber: string,
    nationality: string,
    address: string,
    accountType: string,
    monthlyIncome: string,
    contextStore: string,
    stopOnError: boolean
}): Promise<IFlowInput | {}> {

    const {
        url,
        firstName,
        lastName,
        middleName,
        birthday,
        email,
        phoneNumber,
        nationality,
        address,
        accountType,
        monthlyIncome,
        contextStore,
        stopOnError
    } = args;

    // Check if the args are given
    if (!url) throw new Error("No post api url defined");
    if (!email) throw new Error("The email address is missing.");
    if (!phoneNumber) throw new Error("The phone number is missing.");
    if (!accountType) throw new Error("The account type is missing.");
    if (!monthlyIncome) throw new Error("The monthly income is missing.");
    if (!contextStore) throw new Error("The context Store is missing.");

    const base64DocumentString = createBase64StringFromUserData(firstName, lastName, middleName, birthday, email, phoneNumber, nationality, address, accountType, monthlyIncome);
    const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" \
                        xmlns:v1="http://www.aiasoftware.com/cloud/v1"> \
                        <soapenv:Header/> \
                        <soapenv:Body> \
                            <v1:ComposePdfV1Request> \
                                <v1:partner>CCM</v1:partner> \
                                <v1:customer>local</v1:customer> \
                                <v1:contracttypename>ccminteractive</v1:contracttypename> \
                                <v1:contracttypeversion>V1</v1:contracttypeversion> \
                                <v1:jobid>blub</v1:jobid> \
                                <v1:project>Demo Chatbot</v1:project> \
                                <v1:documenttemplate>Account opening</v1:documenttemplate> \
                                <!--Optional:--> \
                                <v1:status>current</v1:status> \
                                <v1:databackbonexml>${base64DocumentString}</v1:databackbonexml> \
                            </v1:ComposePdfV1Request> \
                        </soapenv:Body> \
                    </soapenv:Envelope>`;

    try {

        const response = await axios.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': '"http://www.aiasoftware.com/cloud/v1/compose/pdf/v1"'
            }
        });

        const re = new RegExp('<tns:document>(.*)<\/tns:document>');
        const r = response.data.match(re);
        if (r) {
            input.actions.addToContext(contextStore, r[1], 'simple');
        } else {
            if (stopOnError) {
                throw new Error('There is no returned document. Please try again.');
            } else {
                input.actions.addToContext(contextStore, { error: 'There is no returned document. Please try again.' }, 'simple');
            }
        }

    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}


module.exports.KCMgetDoc = KCMgetDoc;


/**
 * Takes the user's data and creates a Word document, which is retuned as Base64 string
 * @arg {SecretSelect} `secret` The provided Cognigy secret
 * @arg {CognigyScript} `url` The API post url without path and /
 * @arg {CognigyScript} `wordDocumentBase64` The word document as a base64 string
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function SignDocgetSigDoc(input: IFlowInput, args: { secret: CognigySecret, url: string, wordDocumentBase64: string, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // stephan.mayer@kofax.com
    const { secret, url, wordDocumentBase64, contextStore, stopOnError } = args;
    const { api_key } = secret;

    if (!wordDocumentBase64) throw new Error('The word document base64 string is not defined.');
    if (!url) throw new Error('The API base url is not defined.');
    if (!secret) throw new Error('The secret is not defined');
    if (!api_key) throw new Error("The secret is missing the 'api_key' field.");

    const body = {
        "name": "Account opening",
        "type": "PACKAGE",
        "processingType": "SEQ",
        "signers": [
            {
                "id": "Signer",
                "role": "SIGNER",
                "name": "Customer"
            }
        ],
        "documents": [
            {
                "name": "Schedule",
                "description": "Example",
                "format": "MS_WORD",
                "content": wordDocumentBase64,
                "order": 1,
                "documentMessage": "A customizable message",
                "fileName": "DEMO.docx",
                "signatureFields": [
                    {
                        "name": "signature-1",
                        "signerId": "Signer",
                        "required": false,
                        "readOnly": false,
                        "page": 1,
                        "posx": 70,
                        "posy": 70,
                        "width": 250,
                        "height": 90,
                        "signingModeOptions": [
                            "HW"
                        ]
                    }
                ]
            }
        ]
    };

    let signDocResponse: any;

    try {

        signDocResponse = await axios({
            method: 'POST',
            url: `${url}/cirrus/rest/v6/package?schedule=false&delete_existing=false&autoprepare=false`,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'api-key': api_key,
                'X-API-Key': api_key
            }
        });

    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    try {

        const signDocResponseUpdate = await axios({
            method: 'PUT',
            url: `${url}/cirrus/rest/v6/packages/${signDocResponse.data.id}`,
            data: {
                "state": "PREPARED"
            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'api-key': api_key,
                'X-API-Key': api_key
            }
        });

    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    try {
        const signDocResponseCreateLink = await axios({
            method: 'POST',
            url: `${url}/cirrus/rest/v6/packages/${signDocResponse.data.id}/signingsession/common`,
            data: {

                "manualSignerAuthentications": [
                    {
                        "signerId": "Signer",
                        "passport": true
                    }
                ],
                "qrCodeSpecifications": {
                    "imageType": "JPG",
                    "width": 200,
                    "height": 200
                }

            },
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'api-key': api_key,
                'X-API-Key': api_key
            }
        });

        input.actions.addToContext(contextStore, signDocResponseCreateLink.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}
// stephan.mayer@kofax.com, kitty.koesters@kofax.com
module.exports.SignDocgetSigDoc = SignDocgetSigDoc;

function createBase64StringFromUserData(
    firstName: string,
    lastName: string,
    middleName: string,
    birthday: string,
    email: string,
    phoneNumber: string,
    nationality: string,
    address: string,
    accountType: string,
    monthlyIncome: string,
): string {
    const addressList = address.split(' ');
    const street = addressList[0] || "";
    const houseNumber = addressList[1] || "";
    const zip = addressList[2] || "";
    const city = addressList[3] || "";

    // create the XML structure from Cognigy context
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <Data_Backbone>
            <Customer>
                <FirstName>${firstName}</FirstName>
                <LastName>${lastName}</LastName>
                <MiddleName>${middleName}</MiddleName>
                <DateOfBirth>${birthday}</DateOfBirth>
                <EmailAddress>${email}</EmailAddress>
                <PhoneNumber>${phoneNumber}</PhoneNumber>
                <Nationality>${nationality}</Nationality>
                <Street>${street}</Street>
                <HouseNumber>${houseNumber}</HouseNumber>
                <PostalCode>${zip}</PostalCode>
                <City>${city}</City>
            </Customer>
            <ContactPreference>
                <Type></Type>
            </ContactPreference>
            <Account>
                <Type>${accountType}</Type>
                <Number>Generated</Number>
            </Account>
            <Income>
                <MonthlyIncome>${monthlyIncome}</MonthlyIncome>
                <PaidPer>Month</PaidPer>
            </Income>
        </Data_Backbone>`;

    // encode this XML structure to base64 for the SOAP API from Kofax CCM
    return Buffer.from(xml).toString("base64");
}


/**
 * Creates a case in Kofax KTA (uses CreateCase2 endpoint)
 * @arg {SecretSelect} `secret` Kofax KTA URL
 * @arg {JSON} `payload` The JSON payload for the CreateCase2 Kofax KTA API
 * @arg {CognigyScript} `contextStore` How to store the extracted information to the Cognigy Context object
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function KTAcreateCase(input: IFlowInput, args: { secret: CognigySecret, payload: JSON, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {
    // stephan.mayer@kofax.com
    const { secret, payload, contextStore, stopOnError } = args;
    const { ktaUrl } = secret;

    if (!payload) throw new Error('The JSON payload is not defined');
    if (!contextStore) throw new Error('The context store key name is not defined');


    try {

        const response = await axios({
            method: 'POST',
            url: `${ktaUrl}/TotalAgility/Services/Sdk/CaseService.svc/json/CreateCase2`,
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        input.actions.addToContext(contextStore, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

// stephan.mayer@kofax.com
module.exports.KTAcreateCase = KTAcreateCase;


/**
 * Updates the variables of an ongoing KTA job
 * @arg {SecretSelect} `secret` Kofax KTA URL
 * @arg {JSON} `payload` The JSON payload for the UpdateJobVariables Kofax KTA API
 * @arg {CognigyScript} `contextStore` How to store the extracted information to the Cognigy Context object
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function KTAupdateVariables(input: IFlowInput, args: { secret: CognigySecret, payload: JSON, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    const { secret, payload, contextStore, stopOnError } = args;
    const { ktaUrl } = secret;

    if (!payload) throw new Error('The JSON payload is not defined');
    if (!contextStore) throw new Error('The context store key name is not defined');


    try {

        const response = await axios({
            method: 'POST',
            url: `${ktaUrl}/TotalAgility/Services/Sdk/JobService.svc/json/UpdateJobVariables`,
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        input.actions.addToContext(contextStore, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}

module.exports.KTAupdateVariables = KTAupdateVariables;

