# Microsoft Graph Custom Module

To use the **Microsoft Graph** Custom Module (CM), you have to use the **Azure** CM for Login to your Account. That's important as you will receive the `access_token` which you need for your Graph actions.

Thus, this tutorial is divided into two parts:

- Login into Microsoft
- Using the Graph Module

## Login to Microsoft

### Starting the HTTP Server for our Redirect URI
Before we can start with the process of registering an application and using the graph CM, we need to start an HTTP server for our so-called `RedirectUri`. Go to the attached ZIP file and start an HTTP server with the npm package `http-server`: 

- `http-server static/`

Now the redirect URI is accessible under `http://localhost:8080/auth-callback`.

### Register an Azure Application

1. We need to create a new **Application** in our Azure Portal. Login to [https://portal.azure.com/](https://portal.azure.com/#home) and search for *App registrations*.
2. Click on **New registration** in the top left corner.
3. Name your Application *Graph* or something similar
4. Fill the **Redirect URI** with the following url: 
	5. http://localhost:8080/auth-callback
	6. This url will be called by Microsoft after the user logged in successfully. For Cognigy use, this url could send a message to the bot backend to trigger a new intent.
5. Click on **Register** and create the new application.
6. Now you should see an overview page which includes several IDs, such as:
	7. Application (client) ID
		8. **We need this**
	8. Directory (tenant) ID
	9. Object ID
7. Next to the `clientId`, we need to define a `clientSecret` for our application.
8. Therefore, click on the **Certificates & secrets** button in the left side menu.
	9. Now click on **new client secret**, give it a informative description and set the expiration time to 1 year.
	10. Click on **Add**
	11. It's very important, that you store the `clientSecret` in a password orchestrator on your computer!

### Use the Azure CM for login to Microsoft

Since we registered our Azure Application, we now can use this information for our login process. Cognigy already implemented a Custom Module which will do all login tasks for you:

1. Download the newest version of the **Azure** CM from the [Cognigy Documentation](https://docs.cognigy.com/docs/cognigy-modules).
2. Login to your Cognigy Environment and create a new Project called *Microsoft Graph* or something similar to that. 
3. Create a new Flow called *main* or s.l.t
4. Now you have to define the [Cognigy Secret](https://docs.cognigy.com/docs/secrets) which will include the following values:
	5. Key: `clientId`
		6. Value: The Azure Application's client ID
	6. Key: `clientSecret`
		7. Value: The Azure Application's client Secret — it should be stored on your computer.
5. Now we can upload the Custom Module:
	6. Go to the **Integration Framework** in your Cognigy Environment and upload the CM.
6. Go back to your project and use the **Start Authentication With ADAL** node.
	7. You will find it under the path `Create Node/Modules/azure/` in the node creation menu.
7. We're ready to define the arguments:
	8. Secret: Select your secret
	9. RedirectUri: Fill this with `http://localhost:8080/auth-callback`. This url has to be the same as in your Azure app registration!
	10. Scope: `user.read`
	11. ContextStore: `authStore`
8. If you now start your conversation, the chat will show the **Login with Microsoft** button which routes the user to the login page.
	9. For more information, take a look at the [Github Repository](https://github.com/Cognigy/CustomModules/tree/feature/adal/modules/azureCS).
9. This custom node will return the `microsoftAuth` code, that is stored in `{{ci.data.microsoftAuth.code}}` in the Cognigy chat session.
10. For accessing the final `access_token`, use the **Get Authentication Token With ADAL** node as second and define the following arguments:
	11. Secret: The same declared secret
	12. RedirectUri: The same callback url
	13. AuthCode: `{{ci.data.microsoftAuth.code}}`
	14. ContextStore: `storeThis` or s.l.t
The Microsoft `access_token` will be stored under `{{cc.storeThis.access_token}}`. 

**Finally, we're ready to use the Microsoft Graph CM.**

## Use the Microsoft Graph CM

*For using this CM, it's important, that you followed the previous steps!*

We will now use the **Get User Details** Graph CM node, to show the functionality.

1. Download the **Microsoft Graph** Custom Module from the [Cognigy Documentation](https://docs.cognigy.com/docs/cognigy-modules).
2. Go to your already defined project and upload the CM.
3. Go to your *main* flow and use the **Get User Details** custom node.
4. Define the following arguments:
	5. AccessToken: Fill this with `{{cc.storeThis.access_token}}`
		6. Please adjust this path to your definition
	6. UserSource: Select `me`
		7. You only have to define the *UserMail* argument if you selected *specific person* as the UserSource
	7. ContextStore: `userData` or s.l.t
	8. Write with the chatbot and login to your Microsoft account. Afterwards, your personal Microsoft account data will be stored in the Cognigy Context.


