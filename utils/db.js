import moongose from 'mongoose';

const connection = {};

const connectDb = async () => {

    if(connection.isConnected) {
        console.log("DB connection exist");
        return;
    }

    if(moongose.connections.length > 0){
        connection.isConnected = moongose.connections[0].readyState;

        if(connection.isConnected === 1) {
            console.log("Already connected, use previous connection");
            return;
        }
        await moongose.disconnect();
    }    

    const db = await moongose.connect(process.env.DB_URI);

    console.log("Db connected");

    connection.isConnected = db.connections[0].readyState;
}

const disconnectDb = async () => {

    if(connection.isConnected) {
        if(process.env.NODE_ENV === 'production'){
            await moongose.disconnect();
            connection.isConnected = false;
        }else {
            console.log("Db not disconnected - NODE ENV = DEV")
        }
    }
};

const convertDocToObject = (doc) => {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc._id.toString();

    return doc;
};

const db = {connectDb, disconnectDb, convertDocToObject};

export default db;