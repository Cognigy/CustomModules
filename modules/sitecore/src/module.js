var rp = require('request-promise');

/**
* Retrieve Sitecore Content
* @arg {CognigyScript} `path` Sitecore path
* @arg {Boolean} `getChildren` Get Child Items
* @arg {Select[Specials,Products]} `template` Data Template
* @arg {CognigyScript} `store` Where to store the result
*/

async function GetChildren(input, args) {
    let fullPath = input.context.getFullContext()["endpointUrl"];
    fullPath += input.context.getFullContext()["contentPathID"];

    if(args.getChildren) {
        fullPath += '/children';
    }

    console.log(fullPath);

    var options = {
        uri: fullPath,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true // Automatically parses the JSON string in the response
    };
    
    rp(options)
        .then(function (items) {
            console.log('User has %d items', items.length);
            input.context.getFullContext()[args.store] = items;
        })
        .catch(function (err) {
            return Promise.reject("Error:" + err.message);
        });

    return input;

}

/**
 * @arg {SecretSelect} `secret` The Sitecore secret you want to use.
 * @arg {CognigyScript} `path` Content path in Sitecore
 * @arg {CognigyScript} `store` Context store for verification result
*/
async function GetItem(input, args) {

    const { secret, path, store } = args;

    var options = {
        method: 'GET',
        uri: secret.apiEndpoint,
        qs:
            {
                "path": path
            },
        headers: {
            "Content-Type":"application/json"
        },
        json:true
    };

    const item = await rp(options);

    input.actions.addToContext(store,item, 'simple');
    return Promise.resolve(input);

}

module.exports.GetChildren = GetChildren;
module.exports.GetItem = GetItem;
