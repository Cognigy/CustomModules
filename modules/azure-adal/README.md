# Microsoft Authentication Custom Module

This Custom Module provides to login via Microsoft and returns the `access_token` which is used for **Graph APi**, for example.

**Secrets**

- clientId
    - key: clientId
    - value: The Azure App Regestrations client ID

Login to portal.azure.com and create a new **App regestration**. After this, you will see your client ID.

- clientSecret
    - key: clientSecret
    - value: The Client Secret of your App regestration

You need to click on **Certificates & secrets** in the left side menu and create a new Client secret.

## Node: startAuthentication

This node starts the Webchat plugin `microsoft_auth` to open the **Login with Microsoft** button in the webchat. 

## Node: getAuthenticationToken

This node returns the final `access_token`: 
```json
{
    "key": "value",
    "storeThis": {
        "token_type": "Bearer",
        "scope": "User.Read profile openid email",
        "expires_in": 3600,
        "ext_expires_in": 3600,
        "access_token": "eyJ0eXA...-2dg"
    }
}
```