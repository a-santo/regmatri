const mysql_p = require('mysql2/promise');
const mysql = require('mysql2');
const escape = mysql.escape;
const host = 'localhost';
const user = 'progweb';
const password = 'progweb2020';
const schema = 'progweb2020_regmatri'

const promise = mysql_p.createConnection({
    host: host,
    user: user,
    password: password,
    database: schema
});

const con = mysql.createConnection({
    host	 : host,
    user     : user,
    password : password,
    database : schema
})

con.connect(function(error){
    if(!!error){
        console.log(error);
    }else{
        console.log('Ligação à BD estabelecida com sucesso');
    }
});

function asyncQuery(query, params) {
    console.log('A executar o seguinte query: ', con.format(query, params))
    return new Promise((resolve, reject) =>{
        con.query(query, params, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    con: con,
    escape: escape,
    host: host,
    user: user,
    password: password,
    schema: schema,
    promise: promise,
    asyncQuery: asyncQuery
}