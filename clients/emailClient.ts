import {IEmailClient, IEmailClientConfig, ISendEmail} from "../types";
const nodemailer = require('nodemailer')

const config: IEmailClientConfig = {
    host: process.env.SMTP_EMAIL_HOST,
    service: process.env.SMTP_EMAIL_SERVICE,
    port: parseInt(process.env.SMTP_EMAIL_PORT || "587"),
    auth: {
        user: process.env.SMTP_EMAIL_USERNAME,
        pass: process.env.SMTP_EMAIL_PASSWORD,
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
}

class EmailClient implements IEmailClient {

    private emailClient

    constructor() {
        this.emailClient = nodemailer.createTransport(config)
    }

    public async sendEmail({to = "", subject = "", text = "", html = ""}) {
        const sendInfo:ISendEmail = {
            to,
            subject,
            text,
            html,
            from: `${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_USERNAME}>`,
        }

        return await this.emailClient.sendMail(sendInfo)
    }
}

export default new EmailClient()