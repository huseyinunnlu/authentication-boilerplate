import {Agenda, Job} from "agenda";
import {ISendEmail} from "../types";
import EmailClient from "../clients/emailClient.ts";

const agenda = new Agenda({
    db: {address: process.env.DB_CONNECTION_URL || "", collection: "tasks"}, processEvery: '30 seconds'
});

agenda.define("sendEmail", async (job: Job<ISendEmail>) => {
    const {to, subject, text, html} = job.attrs.data
    console.log("Email Send Started: ", job.attrs.data.to)

    const res = await EmailClient.sendEmail({
        to,
        subject,
        text,
        html,
    })


    if (!res) {
        console.log("Email Send Failed: ", job.attrs.data.to, "Retrying...")

        await agenda.now("sendEmail", {
            to,
            subject,
            text,
            html,
        })

        return false
    }

    console.log("Email Send Finished: ", job.attrs.data.to)
})


await agenda.start()
export default agenda