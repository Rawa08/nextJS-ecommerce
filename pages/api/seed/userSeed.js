import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import {data} from '../../../utils/data'


const handler = nc();

handler.get(async (req, res) => {
    await db.connectDb();
    await User.deleteMany();
    await User.insertMany(data.users)
    await db.disconnectDb();
    res.send({message: "Data created succefylly"});

});

export default handler