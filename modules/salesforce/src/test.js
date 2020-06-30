const axios = require('axios');

const liveAgentUrl = "https://d.la1-c1-fra.salesforceliveagent.com";
const organizationId = "00D1t000000xCYw";
const deploymentId = "5721t000000sYQD";
const livechatButtonId = "5731t000000sYQh";

async function foo() {
    try {
        const sessionResponse = await axios({
          method: "GET",
          url: `https://d.la1-c1-fra.salesforceliveagent.com/chat/rest/System/SessionId`,
          headers: {
            "X-LIVEAGENT-AFFINITY": 'null',
            "X-LIVEAGENT-API-VERSION": '34'
          }
        });

        console.log(sessionResponse.data)
    
    } catch (error) {
        console.log(error)
    }
}

async function fooTwo() {
  try {
    
    const response = await axios({
      method: "GET",
      url: `${liveAgentUrl}/chat/rest/Visitor/Availability?org_id=${organizationId}&deployment_id=${deploymentId}&Availability.ids=${livechatButtonId}`,
      headers: {
        "X-LIVEAGENT-API-VERSION": '34',
      },
    })

    input.actions.addToContext(contextStore, response.data, 'simple');

  } catch (error) {
    console.log(error.message)
  }
}

fooTwo()