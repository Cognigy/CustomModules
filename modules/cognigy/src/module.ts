const nodemailer = require('nodemailer');

/**
 * Send a mail with attachment.
 * @arg {SecretSelect} `secret` The configured secret to use containing all SMTP configuration information
 * @arg {CognigyScript} `fromName` The name of the sender
 * @arg {CognigyScript} `fromEmail` The email address of the sender
 * @arg {CognigyScript} `to` The email addresses you want to send a message
 * @arg {CognigyScript} `subject` The email's subject
 * @arg {CognigyScript} `message` The message. You can use html if you want to add formatted text to your email
 * @arg {CognigyScript} `attachmentName` If you want to send an attachment, please type in the used name for the file
 * @arg {CognigyScript} `attachmentUrl` Please provide the public direct url to the file you want to attach to the mail. Only use this field, if you set a name for the file before
 * @arg {CognigyScript} `contextStore` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */

async function sendEmailWithAttachment(input: any, args: {
    secret: CognigySecret,
    fromName: string,
    fromEmail: string,
    to: string,
    subject: string,
    message: string
    attachmentName?: string,
    attachmentUrl?: string,
    contextStore: string,
    stopOnError: boolean
}): Promise<IFlowInput | {}> {

    if (!args.secret) throw new Error('No secret defined. You need the secret to proivde the email configuration information.');

    let { secret, fromName, fromEmail, to, subject, message, attachmentName, attachmentUrl, contextStore, stopOnError } = args;
    const { host, port, security, user, password } = secret;

    // checking arguments
    if (!fromName) throw new Error('No `from` name defined. This could be the name of your company or your employee, for example.');
    if (!fromEmail) throw new Error('No `from` email address defined.');
    if (!to) throw new Error('No `to` email address defined. You can provide a list of email addresses by just adding them like this: test@test.de, mail@mail.de, ...');
    if (!subject) subject = "";
    if (!message) message = "";

    // check the attachment argument information
    if (attachmentName && !attachmentUrl) throw new Error('You have to define both attachment information. You forgot to define the attachment URL');
    if (!attachmentName && attachmentUrl) throw new Error('You have to define both attachment information. You forgot to define the attachment name');

    if (!contextStore) throw new Error('No context store name defined.');

    // checking secret information
    if (!host) throw new Error('No email host defined. This could be something like smtp.example.com.');
    if (!port) throw new Error('No email port defined. This could be something like 587 or 465.');
    if (!security) throw new Error('No email security option defined. This could be TLS, STARTTLS or NONE.');
    if (!['TLS', 'STARTTLS', 'NONE'].includes(security.trim().toUpperCase())) {
        throw new Error('Invalid email security option defined. This could be TLS, STARTTLS or NONE.');
    }
    if (!user) throw new Error('No email user defined. This is your email username.');
    if (!password) throw new Error('No email password defined. This is your email password.');

    // validate the given email addresses.
    const fromMailValidation = validateEmail(fromEmail);
    if (!fromMailValidation) throw new Error(`The email ${fromEmail} is not valid. Please check it.`);

    for (let em of to.split(',')) {
        let toMailValidation = validateEmail(em.trim());
        if (!toMailValidation) throw new Error(`The email ${em} is not valid. Please check it.`);
    }

    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: security === 'TLS',
            ignoreTLS: security === 'NONE',
            auth: {
                user,
                pass: password
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html: message,
            attachments: [
                {
                    filename: attachmentName,
                    path: attachmentUrl
                },
            ]
        });


        input.actions.addToContext(contextStore, `Message sent: ${info.messageId}`, 'simple');
    } catch (error) {
        if (stopOnError) {
            throw new Error(error);
        } else {
            input.actions.addToContext(contextStore, { error: error }, 'simple');
        }
    }

    return input;
}
module.exports.sendEmailWithAttachment = sendEmailWithAttachment;


function validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}