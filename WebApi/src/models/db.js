import mysql from 'mysql';

export { queryThis };

/**
 * Creates the connection to the database
 */
let con = mysql.createConnection({
    host: 'localhost',
    user: 'THOMAS',
    password: 'password',
    insecureAuth: true
});

/*
 * Sends a query to the database, returns a promise with the query data
 * @param query to send to database
 */
function queryThis(query) {
    return new Promise((resolve, reject) => {
        try {
            con.query(query, function (err, result) {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Connects to the database
 */
con.connect(function (err) {
    if (err) {
        console.log('Cannot connect to database');
        throw err;
    } else {
        console.log('Connected!');
    }
});