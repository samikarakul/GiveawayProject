const Database = require('./db.js');
const MailSender = require('./MailSender.js');
const db = new Database();
const mailSender = new MailSender();

class Giveaway{
    myConn;
    constructor(){
        this.getConnection();
    }
    async getConnection(){
        var x = await db.Connect();
        if(x.result)
        {
            try{
                this.myConn = x.conn;
            }catch(err){
                console.log("err _> ",err)
            }   
        }
        else{
            console.log(x.error);
        }
    }

    GetAllGiveaways = async () => {
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query('select * from Giveaways', (err, rows, fields) =>{
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

    GetAllUnfinishedGiveawaysWithSponsorNames = async (finishDate) => {
        let returnObj = { rows: null, err: null}

        const prom = new Promise((res, rej) => {
            this.myConn.query(`select * from Giveaways inner join Sponsors on Giveaways.SponsorId = Sponsors.SponsorId where EndingDate >= "${finishDate}"`, (err, rows, fields) =>{
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

    GetAllGiveawaysWithSponsorNames = async () => {
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query('select * from Giveaways inner join Sponsors on Giveaways.SponsorId = Sponsors.SponsorId', (err, rows, fields) =>{
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

    GetGiveawayById = async (id) => {
        let returnObj = { rows: null, err: null}
        const prom = new Promise((res, rej) => {
            this.myConn.query(`select * from Giveaways where GiveawayId=${id}`, (err, rows, fields) =>{
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

    UpdateGiveaway = async(giveawayObject) => {
        let returnObj = { rows: null, err: null}
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`update Giveaways set 
                                        Title="${giveawayObject.Title}", 
                                        SponsorId=${giveawayObject.SponsorId}, 
                                        StartingDate="${giveawayObject.StartingDate}", 
                                        EndingDate="${giveawayObject.EndingDate}", 
                                        CoverImage="${giveawayObject.CoverImage}" 
                                    where GiveawayId = ${giveawayObject.GiveawayId}`,
                                               
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

    GetGiveawaysParticipants = async(giveawayId) => {
        let returnObj = { rows: null, err: null}
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`Select * from Participants where GiveawayId = ${giveawayId}`, (err, rows, fields) =>{
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
            var promRes = await prom;
        }catch(catchErr){
            returnObj.err = err;
            console.log(catchErr)
        }
        return returnObj;
    }

    GetGiveawaysPrizes = async(giveawayId) => {
        let returnObj = { rows: null, err: null}
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`Select * from Prize where GiveawayId = ${giveawayId}`, (err, rows, fields) =>{
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
            var promRes = await prom;
        }catch(catchErr){
            returnObj.err = err;
            console.log(catchErr)
        }
        return returnObj;
    }

    CreateGiveaway = async(giveawayObject) => {
        const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
        try{
            const createPromRes = new Promise((res, rej) => {
                this.myConn.query(`insert into Giveaways(Title, SponsorId, StartingDate, EndingDate, CoverImage) 
                                    values("${giveawayObject.Title}", ${giveawayObject.SponsorId}, "${giveawayObject.StartingDate}", "${giveawayObject.EndingDate}",
                                            "${giveawayObject.CoverImage}")`
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

        return returnValue;
    }

    DeleteGiveaway = async(id) => {
        const returnValue = {failed: null, successed: null, failedMessage: null, filename:""}
        try{
            const deletePromRes = new Promise((res, rej) => {
                this.myConn.query(`CALL sp_DeleteGiveawayWithGiveawaysPrizesAndParticipants(${id})`, (err, rows, fields) => {
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

    GetLastDaysFinishedGiveaways = async() => {
        let returnObj = { rows: null, err: null}
        const date = new Date();
        date.setDate(date.getDate() - 4);
        const dateString = date.toLocaleDateString().split(".").reverse().join("-");
        try{
            const prom = new Promise((res, rej) => {
                this.myConn.query(`Select GiveawayId from Giveaways where EndingDate = "${dateString}"`, (err, rows, fields) =>{
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
            var promRes = await prom;
        }catch(catchErr){
            returnObj.err = catchErr.message;
            console.log(catchErr)
        }
        return returnObj;
    }

    DoGiveaway = async(participants, prizes, giveaway) => {
        if(participants != undefined && prizes != undefined && participants.length != 0 && prizes.length != 0){
            const objectArrayForMail = [];
            let tempParticipants = [...participants];
            prizes.sort((a,b) => (a.OrderOfWinning > b.OrderOfWinning) ? 1 : ((b.OrderOfWinning > a.OrderOfWinning) ? -1 : 0))
            for(var i=0; i<prizes.length; i++){
                for(var j=0; j<prizes[i].CountOfWinners; j++)
                {
                    if(tempParticipants.length == 0) tempParticipants = [...participants];
                    const selectedIndex = Math.floor(Math.random() * tempParticipants.length);
                    objectArrayForMail.push({GiveawayId: giveaway.GiveawayId, PrizeId: prizes[i].PrizeId, ParticipantId: tempParticipants[selectedIndex].ParticipantId,
                                            ParticipantEmail:tempParticipants[selectedIndex].Email, GiveawayImage:giveaway.CoverImage,
                                            PrizeImage: prizes[i].PrizeImage, PrizeName:prizes[i].PrizeName })
                    tempParticipants.splice(selectedIndex,1)
                }
            }
            this.SendMailToWinners(objectArrayForMail);

        } 
       
    }

    SendMailToWinners = (mailContents) => {
        if(mailContents != undefined && mailContents.length > 0)
        {
            mailSender.SendEmail(mailContents);
        }
    }
}

module.exports = Giveaway;
