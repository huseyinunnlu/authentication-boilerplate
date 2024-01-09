export interface IEmailClientConfig {
    host: string | undefined
    service: string | undefined
    port: number | undefined
    auth: {
        user: string | undefined
        pass: string | undefined
    },
    secure: boolean | undefined
    tls: {
        rejectUnauthorized: boolean | undefined
    }
}

export interface ISendEmail {
    to: string
    subject: string
    text: string
    html: string
    from?: string
}

export interface IEmailClient {
    sendEmail: (email: ISendEmail) => Promise<any>
}