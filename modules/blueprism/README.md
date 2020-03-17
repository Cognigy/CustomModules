# Blue Prism

This Custom Module integrated Blue Prism RPA with Cognigy.AI. 


**Secret (Blue Prism):**

1. 
    - Key: username
    - Value: The Blue Prism user's username (e.g. admin)
2. 
    - Key: password
    - Value: The Blue Prism user's password (e.g. test123)


## Node: startProcess

This node starts a specific Blue Prism process. It takes the following parameters: 
- `processWSDL`: The url of the process web service endpoint. Please use the raw url without the WSDL information. For example, `http://machine:8181/ws/processName`
- `soapXMLBody`: The Blue Prism web services uses SOAP to handle requests. Since every process has its own configuration, it is required to paste the specific request body in the XML format. This body could look like the following:

```xml
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:blueprism:webservice:processName">
    <soapenv:Header/>
    <soapenv:Body>
       <urn:processName soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>
    </soapenv:Body>
 </soapenv:Envelope>
```

- `contextStore`: Where to store the process result in the Cognigy context.
- `stopOnError`: Whether to stop the whole flow when an error occures or not.

If all parameters are defined, the node resturns the result and stores it into the Cogngiy context.


### Async Process Execution

If your robot takes too much time to execute it synchronously, you can think about an async variant. For this, you need to implement a request forwarder, which instantly returns a `202 HTTP Response` to the Cognigy chatbot. Thus, the bot is able to continue chatting with the user. In the backend, however, you have to call the HTTP Request to start the BluePrism robot and wait for the result.

#### Sending Result to Cognigy

As soon as the robot finished its task, you can send the result back to the Cognigy bot. In doing so, the chatbot is able to use this currently incoming information and use it for further tasks during the conversation.

**How to send data to Cognigy:**

Use the [Cognigy Inject API](https://docs.cognigy.com/reference#inject) to simulate a user message. In this case, the simulated user message would be the robot's RPA result. Therefore, you have to handle the expected result in your Cognigy [Flow](https://docs.cognigy.com/docs/flow).


#### Request Forwarder Example

The needed request forwarder could be developed as the following:

1. Accept the actual request as parameter
2. Forward this request to the foreign system
3. Within the foreign system, call the [Cognigy Inject API](https://docs.cognigy.com/reference#inject)

Finally, an example request forwarder could be called like:

```json
METHOD: POST
URL: https://your-domain.com/request-forwarder
BODYL: {
    "urlToForward": "ROBOT REST POST URL",
    "headersToForward": {},
    "authToForward": {
        "basic": {
            "username": "", 
            "password": ""
        }
    },
    "bodyToFoward": {
      "THE JSON XML BODY"
    }
}
```

**Take a look at the example request forwarder code, [here](./request-forwarder/src/index.ts)**
____

### For Developers: Set up Blue Prism Test Server

If you want to test the Custom Module using your already developed Blue Pism processes, you have to enable the Web Service. After starting Blue Prism locally on your personal computer, go to the command prompt and type in the following: `"C:\Program Files\Blue Prism Limited\Blue Prism Automate\Automate.exe" /resourcepc /public`. This will start the service on your computer. Now you are also able to use this compuer as resource in the conntrol room.

Help:
- If there are any issues with the resource, take a look at this thread [here](https://community.blueprism.com/communities/community-home/digestviewer/viewthread?MessageKey=0e68e54d-dbf6-478a-86ef-100f0e85d6be&CommunityKey=0eb42ccc-db4b-4048-b061-c3608dc3d713&tab=digestviewer).
- [Running process from resource in control room (Video)](https://youtu.be/mHo--7pBibg)

