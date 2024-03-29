const mysql = require('mysql');

const db_config = {

    //local DB
    // host: 'localhost',
    // port: 3307,
    // user: 'root',
    // password: null,
    // database: 'ploishare',
    // ssl: null

    // planetscale DB
    host: "ap-southeast.connect.psdb.cloud",
    port: 3306,
    user: "v5s79zxs53zg6rammbcm",
    password: "pscale_pw_2ztnoGvXVE43AlGySUREP5LzUY9WmCfDMY2eFHTZ75V",
    database: "twt",
    ssl: { "rejectUnauthorized": true }

    //filess DB
    // host: "wl7.h.filess.io",
    // port: 3307,
    // user: "test_storebegun",
    // password: "91e5084fc48278128c391c0d69df024a486cf06a",
    // database: "test_storebegun",
    // ssl: null

    //alibaba DB
    // host: "8.219.79.249",
    // port: 3306,
    // user: "username",
    // password: "password",
    // database: "ploishare",
    // ssl: null

};
connection = mysql.createPool(db_config);

connection.getConnection(function (err) {
    if (err) {
        // mysqlErrorHandling(connection, err);
        console.log("Cannot establish a connection with the database.");

        connection = reconnect(connection);
    } else {
        console.log("Connection database successful!");
    }
});

function reconnect(connection) {
    console.log("\n New connection tentative...");
    //- Create a new one
    connection = mysql.createPool(db_config);
    //- Try to reconnect
    connection.getConnection(function (err) {
        if (err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect(connection), 2000);
        } else {
            console.log("New connection established with the database.");
            return connection;
        }
    });
}

connection.on("error", function (err) {
    //-
    //- The server close the connection.
    //-
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
        return reconnect(connection);
    } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
        console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
        return reconnect(connection);
    } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
        console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
        return reconnect(connection);
    } else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
        console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
    } else {
        console.log("/!\\ Cannot establish a connection with the database. /!\\ (" + err.code + ")");
        return reconnect(connection);
    }
});

module.exports = connection;