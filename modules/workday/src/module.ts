import axios from 'axios';


/**
 * This node gets the holiday calendar information of an employee
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `id` The bsvc ID
 * @arg {CognigyScript} `page` The bsvc page
 * @arg {CognigyScript} `count` The bsvc count
 * @arg {Boolean} `includePreference` Whether to include the preference or not
 * @arg {Boolean} `includeHolidayCalendarDate` Whether to include the holiday calendar or not
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getHolidayCalendars(input: any, args: { secret: CognigySecret, id: string, page: number, count: number, includePreference: boolean, includeHolidayCalendarDate: boolean, contextStore: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

    const { secret,  id, page, count, includePreference, includeHolidayCalendarDate, contextStore, stopOnError } = args;
    const { url, username, password } = secret;

    if (!secret) throw new Error('No secret defined.');
    if (!id) throw new Error('No workday Process Web Service WSDL defined.');
    if (!page) throw new Error('No process name defined.');
    if (!count) throw new Error('No process name defined.');
    if (!contextStore) throw new Error('No Cognigy context store key defined. It is needed to store the request result into the context object.');

    if (!username) throw new Error("The secret is missing the 'username' key. Add it with the workday user's username");
    if (!password) throw new Error("The secret is missing the 'password' key. Add it with the workday user's password");
    if (!url) throw new Error("The secret is missing the 'url' key. Add it with the workday instance url");

    try {

        const response = await axios({
            method: 'get',
            url,
            headers: {
                'Content-Type': 'text/xml'
            },
            auth: {
                username,
                password
            },
            data: `
            <Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bsvc="urn:com.workday/bsvc">
                <Header>
                    <Workday_Common_Header>
                        <!-- Optional: -->
                        <Include_Reference_Descriptors_In_Response>
                            ?
                        </Include_Reference_Descriptors_In_Response>
                    </Workday_Common_Header>
                </Header>
                <Body>
                    <Get_Holiday_Calendars_Request xmlns:bsvc="urn:com.workday/bsvc" bsvc:version="string">
                        <!-- You have a CHOICE of the next 2 items at this level -->
                        <!-- Optional: -->
                        <Request_References>
                            <!-- 1 or more repetitions: -->
                            <Holiday_Calendar_Request_Reference bsvc:Descriptor="string">
                                <!-- Zero or more repetitions: -->
                                <ID bsvc:type="string">
                                    ${id}
                                </ID>
                            </Holiday_Calendar_Request_Reference>
                        </Request_References>
                        <!-- Optional: -->
                        <Request_Criteria />
                        <!-- Optional: -->
                        <Response_Filter>
                            <!-- Optional: -->
                            <Page>
                                ${page}
                            </Page>
                            <!-- Optional: -->
                            <Count>
                                ${count}
                            </Count>
                        </Response_Filter>
                        <!-- Optional: -->
                        <Response_Group>
                            <!-- Optional: -->
                            <Include_Reference>
                                ${includePreference}
                            </Include_Reference>
                            <!-- Optional: -->
                            <Include_Holiday_Calendar_Data>
                                ${includeHolidayCalendarDate}
                            </Include_Holiday_Calendar_Data>
                        </Response_Group>
                    </Get_Holiday_Calendars_Request>
                </Body>
            </Envelope>
            `
        });

        input.actions.addToContext(contextStore, response.data, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error.message);
        } else {
            input.actions.log('error', 'Error in Workday - Get Holiday Calendars: ' + error);
            input.actions.addToContext(contextStore, { error: error.message }, 'simple');
        }
    }

    return input;
}
module.exports.getHolidayCalendars = getHolidayCalendars;