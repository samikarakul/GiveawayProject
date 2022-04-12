const mysql = require('mysql2');

class Database{
    constructor(){
        this.connectionError = "";    
        this.conn;
    }
    Connect(){
        const prom = new Promise((res, rej) => {
            this.conn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'Giveaway'
            });
            this.conn.connect((err) => {
                if(!err){
                    res({result: true, err: null, conn: this.conn})
                }
                else rej({result: false, err: err});
            });

        })
        return prom;
    }
}

module.exports = Database;

