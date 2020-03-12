# Blue Prism

This Custom Module integrated Blue Prism RPA with Cognigy.AI. 


**Secret (Blue Prism):**

1. 
    - Key: username
    - Value: The Blue Prism user's username (e.g. admin)
2. 
    - Key: password
    - Value: The Blue Prism user's password (e.g. test123)

**Secret (Async):**

- Key: api_key
- Value: The Cognigy Request Forwarder API Key. Please contact us.


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


## Node: startProcessAsync (IN DEVELOPMENT)

If your robot takes too much time to execute is synchronously, you can use this async variant. It takes the process request as `body` parameter and directly returns a `200 OK` response. 


You need the **JSON** body for this custom module node: 

``` json
{
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
____

### For Developers: Set up Blue Prism Test Server

If you want to test the Custom Module using your already developed Blue Pism processes, you have to enable the Web Service. After starting Blue Prism locally on your personal computer, go to the command prompt and type in the following: `"C:\Program Files\Blue Prism Limited\Blue Prism Automate\Automate.exe" /resourcepc /public`. This will start the service on your computer. Now you are also able to use this compuer as resource in the conntrol room.

Help:
- If there are any issues with the resource, take a look at this thread [here](https://community.blueprism.com/communities/community-home/digestviewer/viewthread?MessageKey=0e68e54d-dbf6-478a-86ef-100f0e85d6be&CommunityKey=0eb42ccc-db4b-4048-b061-c3608dc3d713&tab=digestviewer).
- [Running process from resource in control room (Video)](https://youtu.be/mHo--7pBibg)

