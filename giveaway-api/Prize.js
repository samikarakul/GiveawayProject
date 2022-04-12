const Database = require('./db.js');
const multer = require('multer')
const db = new Database();

class Prize{
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

    GetPrizeById = async (id) => {
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query(`select * from Prize where PrizeId=${id}`, (err, rows, fields) =>{
                if(!err) {
                    if(!rows[0])
                    {
                        rows[0] = {};
                    }
                    returnObj.rows = rows[0];
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

    storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            const path = __dirname.replaceAll("\\", "/") + "/prize_images/"; 
            callBack(null, "./")   
        },
        filename: (req, file, callBack) => {
            const path = __dirname.replaceAll("\\", "/") + "/prize_images/"
            callBack(null, path + Date.now() + "." +file.originalname.split(".")[file.originalname.split(".").length -1])
        }
    })
     
    upload = multer({
        storage: this.storage
    });

    UpdatePrize = async(prizeObject) => {
        let returnObj = { rows: null, err: null}
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`update Prize set 
                                        PrizeName="${prizeObject.PrizeName}", 
                                        PrizeImage="${prizeObject.PrizeImage}", 
                                        CountOfWinners=${prizeObject.CountOfWinners}
                                    where PrizeId = ${prizeObject.PrizeId}`,
                                               
                                (err, rows, fields) =>{
                    if(!err) {
                        res(returnObj)
                    }
                    else {
                        returnObj.err = err;
                        rej(returnObj);
                    }
                });
            });
            var promRes = await prom;
        }catch(catchErr){
            returnObj.err = err;
            console.log(catchErr)
        }
        return returnObj;
    }

    UpdatePrizeOrderOfWinning = async(prizeObject) => {
        let returnObj = { rows: null, err: null}
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`update Prize set 
                                        OrderOfWinning = ${prizeObject.OrderOfWinning}
                                    where PrizeId = ${prizeObject.PrizeId}`,
                                               
                                (err, rows, fields) =>{
                    if(!err) {
                        res(returnObj)
                    }
                    else {
                        returnObj.err = err;
                        rej(returnObj);
                    }
                });
            });
            var promRes = await prom;
        }catch(catchErr){
            returnObj.err = err;
            console.log(catchErr)
        }
        return returnObj;
    }

    CreatePrize = async(prizeObject) => {
        const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
        const lastOrderOfWinning = await this.GetLastOrderOfWinning(prizeObject.GiveawayId);
        if(lastOrderOfWinning != undefined && !lastOrderOfWinning.err){
            try{
                prizeObject.OrderOfWinning = lastOrderOfWinning.orderOfWinning + 1;
                const createPromRes = new Promise((res, rej) => {
                    this.myConn.query(`insert into Prize(PrizeName, PrizeImage, GiveawayId, OrderOfWinning, CountOfWinners) 
                                        values("${prizeObject.PrizeName}", "${prizeObject.PrizeImage}",${prizeObject.GiveawayId}, ${prizeObject.OrderOfWinning},
                                                ${prizeObject.CountOfWinners})`
                                        , (err, rows, fields) => {
                        if(!err) {
                            returnValue.failed = false;
                            returnValue.successed=true;
                            returnValue.error=false;
                            res(returnValue)
                        }
                        else {
                            returnValue.failed=true;
                            returnValue.successed=false;
                            returnValue.error=true;
                            returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                            returnValue.errorMessage = err;
                            rej(returnValue);
                        }
                    });
                }); 
        
                var promRes = await createPromRes;
            }catch(trycatch_err){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=true;
                returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                returnValue.errorMessage = trycatch_err;
            }
    
        }
        
        return returnValue;
    }

    DeletePrize = async(id) => {
        const returnValue = {failed: null, successed: null, failedMessage: null, filename:""}
        try{
            const deletePromRes = new Promise((res, rej) => {
                this.myConn.query(`delete from Prize where PrizeId = ${id}`, (err, rows, fields) => {
                    if(!err) {
                        returnValue.failed = false;
                        returnValue.successed=true;
                        returnValue.error=false;
                        res(returnValue)
                    }
                    else {
                        returnValue.failed=true;
                        returnValue.successed=false;
                        returnValue.error=true;
                        returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                        returnValue.errorMessage = err;
                        rej(returnValue);
                    }
                });
            }); 

            await deletePromRes;
        }catch(trycatch_err){
            returnValue.failed=true;
            returnValue.successed=false;
            returnValue.error=true;
            returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
            returnValue.errorMessage = trycatch_err;
        }
        return returnValue;
    } 

    GetLastOrderOfWinning = async(giveawayId) => {
        let returnObj = { res: false, err: null, orderOfWinning: 0}
        try {
            const prom = new Promise((res, rej) => {
                this.myConn.query(`select * from Prize where GiveawayId ="${giveawayId}" order by OrderOfWinning desc limit 1`, (err, rows, fields) =>{
                    if(!err) {
                        if(rows.length > 0){
                            returnObj.res = true;
                            returnObj.orderOfWinning = rows[0].OrderOfWinning;
                        } 
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

module.exports = Prize;