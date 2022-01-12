import db from "./db";

export const getError = err => {
    if(err.response && err.response.data && err.response.data.message) return err.response.data.message;
    
    return err.message;
};

export const onError = async (err, req, res, next) => {
    await db.disconnectDb();

    if(err.path === '_id'){
        return res.status(500).send({message: 'Wrong id type'});
    }
    else {
        res.status(500).send({message: err.toString()});
    }
    
}