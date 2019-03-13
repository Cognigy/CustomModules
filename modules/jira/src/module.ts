const JiraClient = require('jira-connector');

/**
 * This function takes the input text and automatically extracts a ticket number (e.g. SB-2 or TIF-1234). You select where to store it. 
 * @arg {CognigyScript} `storeTicket` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function extractTicket(input: IFlowInput, args: { secret: CognigySecret, storeTicket: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  return new Promise((resolve, reject) => {

    const pattern = /[a-zA-Z]+-\d+/g;
    let match = input.input.text.match(pattern);

    if (match) {
      input.context.getFullContext()[args.storeTicket] = match[0];
      resolve(input);
    } else {
      input.context.getFullContext()[args.storeTicket] = "No Ticket Found";
      resolve(input);
    }
  });
}

module.exports.extractTicket = extractTicket;


/**
 * Returns the status of a given ticket (e.g. 'In progress')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketStatus(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.status
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketStatus = getTicketStatus;


/**
 * Returns the assignee of a given ticket (e.g. bob@bob.com). 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketAssignee(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.assignee
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketAssignee = getTicketAssignee;


/**
 * Returns the priority of a given ticket (e.g. 'normal')
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketPriority(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.priority
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketPriority = getTicketPriority;


/**
 * Returns the resolution if the ticket has one
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketResolution(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.resolution
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketResolution = getTicketResolution;


/**
 * Returns the reporter of the ticket (e.g. bob@bob.com)
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketReporter(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.reporter
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketReporter = getTicketReporter;


/**
 * Returns comments on this ticket, if it has any. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketComments(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.comment
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketComments = getTicketComments;


/**
 * Returns a list (array) of people watching the ticket. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketWatchers(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        let result = {
          ticket: issue.key,
          status: issue.fields.watches
        }
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      }
    });
  });
}

module.exports.getTicketWatchers = getTicketWatchers;

/**
 * Returns basic summary of the ticket, including: type, project, status, assignedTo, reportedBy, resolution and comments. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getTicketSummary(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result: any = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        try {
          let result = {
            ticket: issue.key ? issue.key : "not given",
            type: issue.fields.issuetype.name ? issue.fields.issuetype.name : "not given",
            project: issue.fields.project.name ? issue.fields.project.name : "not given",
            status: issue.fields.status.name ? issue.fields.status.name : "not given",
            assignedTo: issue.fields.assignee.emailAddress ? issue.fields.assignee.emailAddress : "not given",
            reportedBy: issue.fields.reporter.emailAddress ? issue.fields.reporter.emailAddress : "not given",
            resolution: issue.fields.resolution.name ? issue.fields.resolution.name : "not given",
            comments: issue.fields.comment.comments ? issue.fields.comment.comments : "not given"
          }
          input.context.getFullContext()[args.store] = result;
          resolve(input);
        } catch (e) {
          if (args.stopOnError) { reject(error.message); return; }
          result = { "error": e.message };
          input.context.getFullContext()[args.store] = result;
          resolve(input);
        }
      }
    });
  });
}

module.exports.getTicketSummary = getTicketSummary;


/**
 * Returns the full JIRA response, including ALL meta data. Use this if you need more info. 
 * @arg {SecretSelect} `secret` The configured secret to use
 * @arg {CognigyScript} `ticket` The ticket number e.g. ABC-1234
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function getAllTicketInfo(input: IFlowInput, args: { secret: CognigySecret, ticket: string, store: string, stopOnError: boolean }): Promise<IFlowInput | {}> {

  // Check if secret exists and contains correct parameters
  if (!args.secret || !args.secret.username || !args.secret.password || !args.secret.domain) return Promise.reject("Secret not defined or invalid.");
  if (!args.ticket) return Promise.reject("No ticket defined. Please define a ticket like AB-1234");

  return new Promise((resolve, reject) => {
    let result = {};

    const jira = new JiraClient({
      host: args.secret.domain,
      basic_auth: {
        username: args.secret.username,
        password: args.secret.password
      }
    });

    jira.issue.getIssue({
      issueKey: args.ticket
    }, function (error, issue) {
      if (error) {
        if (args.stopOnError) { reject(error.message); return; }
        result = { "error": error.message };
        input.context.getFullContext()[args.store] = result;
        resolve(input);
      } else {
        input.context.getFullContext()[args.store] = issue;
        resolve(input);
      }
    });
  });
}

module.exports.getAllTicketInfo = getAllTicketInfo;




