const Database = require('./db.js');
const db = new Database();

class Participant{
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
    
    async GetAllParticipants(){
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query('select * from Participants', (err, rows, fields) =>{
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

    async CheckIfParticipantExists(participantObj){
        let returnObj = { res: false, err: null}
        try {
            const prom = new Promise((res, rej) => {
                this.myConn.query(`select * from Participants where Email ="${participantObj.email}" and GiveawayId = ${participantObj.giveawayId}`, (err, rows, fields) =>{
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
            return prom;
            
        } catch (error) {
            console.log(error);
        }
    }

    async CreateNewParticipant(newParticipant){
        let resObj = {res: null,resMessage: null, errorMessage: null}
        if(newParticipant){
            Object.keys(newParticipant).forEach((key,index) => {
                if(!newParticipant[key]){
                    resObj.resMessage = "Lütfen tüm değerleri doldurun.";
                    resObj.res = false;
                }
            });
        }

        if(resObj.res != null && resObj.res === false) return resObj;

        const createPromRes = new Promise((res, rej) => {
            this.myConn.query(`insert into Participants(FirstName, LastName, Email, GiveawayId) values("${newParticipant.firstName}", "${newParticipant.lastName}","${newParticipant.email}", ${newParticipant.giveawayId})`
                                , (err, rows, fields) => {
                if(!err) {
                    resObj.res = true;
                    res(resObj)
                }
                else {
                    resObj.errorMessage = err;
                    resObj.res = false;
                    rej(resObj);
                }
            });
        }); 

        return createPromRes;

    }
}
module.exports = Participant;