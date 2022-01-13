import nc from 'next-connect';
import {isAuth, onError} from '../../../utils/auth';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_KEY);


const adminEmail = process.env.ADMIN_EMAIL;

const handler = nc({ onError });

handler.use(isAuth);

handler.post(async (req,res) => {
    try{
        
        const {to, subject, htmlContent, text} = req.body;

        await sendgrid.send({
            to,from: adminEmail, subject, text: text? text:null, html: htmlContent? htmlContent:null
        });

        return res.status(200).send({message: 'Mail Sent!'});
    }catch(err){
        
        return res.status(500).send({message: err});
    }
});

export default handler;