const Database = require('./db.js');
const db = new Database();

class Admin{
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

    async AdminLogin(adminObj){
        let returnObj = { res: false, err: null}
        try {
            const prom = new Promise((res, rej) => {
                this.myConn.query(`select * from Admins where Username ="${adminObj.username}" and AdminPassword ="${adminObj.password}"`, (err, rows, fields) =>{
                    if(!err) {
                        if(rows.length > 0) returnObj.res = true;
                        res(returnObj)
                    }
                    else {
                        returnObj.err = err;
                        rej(returnObj);
                    }
                });
            });
            var promRes = await prom;
            returnObj.res = promRes.res;
            
        } catch (error) {
            returnObj.res = false;
            returnObj.err = error.message;
            console.log(error);
        }

        return returnObj;
    }
}

module.exports = Admin;