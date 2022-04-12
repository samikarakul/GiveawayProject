const Database = require('./db.js');
const db = new Database();

class Sponsor{
    myConn;
    constructor(){
        this.getConnection();
    }
    async getConnection(){
        var x = await db.Connect();
        if(x.result)
        {
            this.myConn = x.conn;
        }
        else{
            console.log(x.error);
        }
    }

    GetAllSponsors = async () => {
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query('select * from Sponsors', (err, rows, fields) =>{
                if(!err) {
                    returnObj.rows = rows;
                    res(returnObj)
                }
                else {
                    returnObj.err = err;
                    rej(returnObj);
                }
            });
        });
        return prom;
    }

}

module.exports = Sponsor;