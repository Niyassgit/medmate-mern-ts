import nodemailer from "nodemailer"
import { INotificationService } from "../../domain/common/services/INotificationService"



export class NotificationService implements INotificationService{
   
    private transporter;

    constructor(){
       this.transporter=nodemailer.createTransport({
         host:process.env.SMTP_HOST,
         port:Number(process.env.SMTP_PORT) || 587,
         secure:false,
         auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
         }

       });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
         this.transporter.sendMail({
            to,
            subject,
            text:body,
            html:`<p>${body}</p>`,
        });
    }

}