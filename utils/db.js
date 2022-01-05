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
            console.log("Alredy connected, use previeus connection");
            return;
        }
        await moongose.disconnect();
    }    

    const db = await moongose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    console.log("Db connected");

    connection.isConnected = db.connections[0].readyState;
}

const disconnectDb = async () => {

    if(connection.isConnected) {
        if(process.env.NODE_ENV === 'production'){
            await moongose.disconnect();
            connect.isConnected = false;
        }else {
            console.log("Db not disconnected - Dev ENV")
        }
    }

    if(moongose.connections.length > 0){
        connection.isConnected = moongose.connections[0].readyState;

        if(connection.isConnected === 1) {
            console.log("Alredy connected, use previeus connection");
            return;
        }
        await moongose.disconnect();
    }    

    const db = await moongose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    console.log("Db connected");

    connection.isConnected = db.connections[0].readyState;


};

const db = {connectDb, disconnectDb};

export default db;