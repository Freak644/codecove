import {Worker} from 'bullmq';
import { bullRedis } from '../queue/IOconnection.js';
import { sendTheMail } from '../../EmailService/nodemailer.js';

new Worker("emailQue",
    async (job) => {
        let {mail,subject,tempLate,infoObj, mailType} = job.data;

        await sendTheMail(mail,subject,tempLate,infoObj);
    },{connection:bullRedis, concurrency: 3}
)