import nc from 'next-connect';
import {isAuth} from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.get(async (req,res) => (res.send(process.env.PAYPAL_CLIENT || 'sb')));

export default handler;