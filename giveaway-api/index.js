const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const cors = require('cors')
const multer = require('multer')
const Participant = require('./Participant');
const Admin = require('./Admin');
const Giveaway = require('./Giveaway');
const Sponsor = require('./Sponsor');
const Prize = require('./Prize');

app.use(cors())

app.use(express.static("./public"))

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    const resObj = {failed: false, error: null, failedMessage: null}
    bodyparser.json()(req, res, err => {
        try{
            if (err) {
                resObj.failed=true;
                resObj.error = err.message;
                resObj.failedMessage = "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
                return res.send(resObj);
            }
            next();

        }catch(e){
            resObj.failed=true;
            resObj.error = e.message;
            resObj.failedMessage = "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            return res.send(resObj);

        }


    });
});


app.use(bodyparser.json());

app.listen(3001, async () => {
    if(giveaway.myConn == undefined){
        setTimeout(() => {
            TerminateGiveaways();
        }, 500)
    }
});


const TerminateGiveaways = async() => {
    const hour = new Date().getHours();
    if(hour == 23){
        const giveawayReq = await giveaway.GetLastDaysFinishedGiveaways();
        if(!giveawayReq.err){
            const giveawayIds = giveawayReq.rows;
            if(giveawayIds != undefined && giveawayIds.length > 0)
            {
                for(var i=0; i<giveawayIds.length; i++)
                {
                    const participantReq = await giveaway.GetGiveawaysParticipants(giveawayIds[i].GiveawayId);
                    const participants = participantReq.rows;
                    const prizeReq = await giveaway.GetGiveawaysPrizes(giveawayIds[i].GiveawayId);
                    const prizes = prizeReq.rows;
                    const sonuc = await giveaway.DoGiveaway(participants, prizes, giveawayIds[i]); 
                }
            }
        }
    }
    setTimeout(() => {
        TerminateGiveaways();
    }, 1000*60*60);
}


const participant = new Participant();
app.get('/participants', async (req,res) => {
    let result = await participant.GetAllParticipants();
    if(!result.err)
    {
        res.send(result.rows);
    }
    else res.send([]);
});


app.post('/participants', async (req,res) => {
    const reqParticipant = req.body;
    let resAnswer = {message: "", failed:false, successed:false};
    try{
        let result = await participant.CheckIfParticipantExists(reqParticipant);
        if(!result.err)
        {
            if(!result.res)
            {
                var createRes = await participant.CreateNewParticipant(reqParticipant);
                if(createRes.errorMessage) {
                    resAnswer.message = "Kaydınız oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."                    
                    resAnswer.failed = true;
                }
                else{
                    if(createRes.resMessage) resAnswer = createRes.resMessage;
                    else{
                        resAnswer.message = "ONAYLANDI";
                        resAnswer.successed = true;
                    } 
                }
            }
            else
            {
                resAnswer.message = "Bu email ile daha önce çekilişe katılım sağlanmıştır. Lütfen başka bir email hesabı ile tekrar deneyin...";
                resAnswer.failed = true;

            } 
        }
        else{
            resAnswer.message = "Bir hata oluştu....";
            resAnswer.failed = true;
        } 
        res.send(resAnswer);

    }catch(error){
        res.send(error.message);
    }
});

const admin = new Admin();
app.post('/login', async (req,res) => {
    const resObj = {successed: false, failed: false, error: null, failedMessage: null};
    try{
        const reqAdmin = req.body;
        if(reqAdmin){
            if(reqAdmin["username"] && reqAdmin["password"])
            {
                const adminLoginReqResponse = await admin.AdminLogin(reqAdmin);
                if(adminLoginReqResponse)
                {
                    if(adminLoginReqResponse.err)
                    {
                        resObj.failed=true;
                        resObj.error = adminLoginReqResponse.err;
                        resObj.failedMessage = "Giriş yapılırken bir sorun oluştu. Lütfen tekrar deneyin.";
                    }
                    if(!adminLoginReqResponse.res)
                    {
                        resObj.failed=true;
                        resObj.failedMessage="Kullanıcı adı veya şifre hatalı.";
                    }
                    if(adminLoginReqResponse.res)
                    {
                        resObj.successed=true;
                        resObj.failed=false;
                    }
                }
    
            }
            else{
                resObj.failed=true;
                resObj.failedMessage="Gerekli olan kullanıcı adı ve şifre bilgilerini girmediniz.";
            }
        }
    }catch(error){
        resObj.failed = true;
        resObj.error = error;
        resObj.failedMessage = "Beklenmeyen bir hata meydana geldi. Lütfen tekrar deneyin.";   
    }
    res.send(resObj);
});


const giveaway = new Giveaway();
app.get('/giveaways', async (req,res) => {
    const current = new Date().toLocaleDateString().split(".").reverse().join("-");
    let result = await giveaway.GetAllUnfinishedGiveawaysWithSponsorNames(current);    
    if(!result.err)
    {
        result.rows = result.rows.map(row => ({
            ...row,
            StartingDate: new Date(row.StartingDate).toLocaleDateString().replaceAll(".","-"),
            EndingDate: new Date(row.EndingDate).toLocaleDateString().replaceAll(".","-")
        }));
        res.send(result.rows);
    }
    else res.send([]);
});

app.post('/giveaways', async(req, res) => {
    const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
    try{
        const giveawayObject = req.body;
        if(giveawayObject){
            if(Object.keys(giveawayObject).length){
                for(var i=0; i<Object.keys(giveawayObject).length; i++){
                    if(!giveawayObject[Object.keys(giveawayObject)[i]]){
                        returnValue.failed=true;
                        returnValue.successed=false;
                        returnValue.error=false;
                        returnValue.failedMessage="Boş değer girilemez!";
                        res.send(returnValue);
                    }
                }
            }
            const requiredProps = ["Title", "SponsorId","StartingDate","EndingDate","CoverImage"]
            if(!IsObjectContainsRequiredProps(giveawayObject, requiredProps)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="İstenen alanlar doldurulmadı.";
                res.send(returnValue);
            }    
            if(new Date(giveawayObject.EndingDate).getTime() < new Date(giveawayObject.StartingDate).getTime())
            {
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="Starting Date can not be later than Ending Date!";
                res.send(returnValue);
            }
            if(isNaN(giveawayObject["SponsorId"] / 1)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="Sponsor alanı hatalı formatta girildi.";
                res.send(returnValue);
            }
            var createRes = await giveaway.CreateGiveaway(giveawayObject);
            if(createRes.error){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=true;
                returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                returnValue.errorMessage=createRes.errorMessage;
                res.send(returnValue)
            }
            if(createRes.failed){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage=createRes.failedMessage;
                returnValue.errorMessage=null;
                res.send(returnValue)
            }
            if(createRes.successed){
                returnValue.failed=false;
                returnValue.successed=true;
                returnValue.error=false;
                returnValue.failedMessage=null;
                returnValue.errorMessage=null;
                res.send(returnValue)
            }
        }
    }catch(trycatch_err){
        returnValue.failed=true;
        returnValue.successed=false;
        returnValue.error=true;
        returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
        returnValue.errorMessage = trycatch_err.message;
        res.send(returnValue);
    }
});

app.delete('/giveaways', async(req,res)=> {
    const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
    const giveawayObject = req.body;
    const requiredProps = ["GiveawayId","Title", "SponsorId","StartingDate","EndingDate", "CoverImage"]
    if(!IsObjectContainsRequiredProps(giveawayObject, requiredProps)){
        returnValue.failed=true;
        returnValue.successed=false;
        returnValue.error=false;
        returnValue.failedMessage="İstenen alanlar doldurulmadı.";
        res.send(returnValue);
        return;
    } 
    const result = await giveaway.DeleteGiveaway(giveawayObject.GiveawayId);
    res.send(result)
})


app.get('/giveaways/:id', async (req,res) => {
    let result = await giveaway.GetGiveawayById(req.params.id);
    if(!result.err)
    {
        result.rows = ({            
            ...result.rows,
            StartingDate: new Date(result.rows.StartingDate).toLocaleDateString().replaceAll(".","-"),
            EndingDate: new Date(result.rows.EndingDate).toLocaleDateString().replaceAll(".","-")
        })
        res.send(result.rows);
    }
    else res.send([]);
});

app.patch('/giveaways/:id', async(req,res)=> {
    const requestBody = req.body;
    let result = await giveaway.UpdateGiveaway(requestBody);
    res.send(result)
})

app.get('/giveaways/:id/participants', async (req,res) => {
    let result = await giveaway.GetGiveawaysParticipants(req.params.id);
    if(!result.err)
    {
        res.send(result.rows);
    }
    else res.send([]);
});

app.get('/giveaways/:id/prizes', async (req,res) => {
    let result = await giveaway.GetGiveawaysPrizes(req.params.id);
    if(!result.err)
    {
        res.send(result.rows);
    }
    else res.send([]);
});

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const path = __dirname.replaceAll("\\", "/") + "/img/"; 
        callBack(null, "./")    
    },
    filename: (req, file, callBack) => {
        const path = __dirname.replaceAll("\\", "/") + "/img/"
        callBack(null, path + Date.now() + "." +file.originalname.split(".")[file.originalname.split(".").length -1])
    }
})
 
var upload = multer({
    storage: storage
});
app.post("/upload", upload.single('file'), (req, res) => {
    const returnObj = {failed: null, successed: null, failedMessage: null, filename:""}
    if (!req.file) {
        returnObj.failed=true;
        returnObj.successed = false;
        returnObj.failedMessage = "Dosya işlenemedi."
    } else {
        returnObj.failed=false;
        returnObj.successed=true;
        returnObj.filename = req.file.filename.split("/")[req.file.filename.split("/").length - 1];
    }
    res.send(returnObj)
});


app.get('/image/:img', (req, res) => {
    const path = __dirname.replaceAll("\\", "/") + "/img/" + req.params.img; 
    res.sendFile(path);
})


const sponsor = new Sponsor();
app.get('/sponsors', async (req,res) => {
    let result = await sponsor.GetAllSponsors();
    if(!result.err)
    {
        res.send(result.rows);
    }
    else res.send([]);
});

const prize = new Prize();

app.get('/prize_image', (req,res) => {
    const path = __dirname.replaceAll("\\", "/") + "/prize_images/highway.jpg"; 
    res.sendFile(path);
})
app.get('/prize_image/:img', (req, res) => {
    const path = __dirname.replaceAll("\\", "/") + "/prize_images/" + req.params.img; 
    res.sendFile(path);
})

app.get('/prizes/:id', async (req,res) => {
    let result = await prize.GetPrizeById(req.params.id);
    if(!result.err)
    {
        res.send(result.rows);
    }
    else res.send([]);
});

app.post('/prizes', async(req, res) => {
    const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
    try{
        const prizeObject = req.body;
        if(prizeObject){
            if(Object.keys(prizeObject).length){
                for(var i=0; i<Object.keys(prizeObject).length; i++){
                    if(!prizeObject[Object.keys(prizeObject)[i]]){
                        returnValue.failed=true;
                        returnValue.successed=false;
                        returnValue.error=false;
                        returnValue.failedMessage="Boş değer girilemez!";
                        res.send(returnValue);
                    }
                }
            }
            const requiredProps = ["PrizeName", "PrizeImage","GiveawayId", "CountOfWinners"]
            if(!IsObjectContainsRequiredProps(prizeObject, requiredProps)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="İstenen alanlar doldurulmadı.";
                res.send(returnValue);
            }    
            if(isNaN(prizeObject["CountOfWinners"] / 1)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="Count of Winners alanları sayısal değer girilmek zorundadır!";
                res.send(returnValue);
            }
            var createRes = await prize.CreatePrize(prizeObject);
            if(createRes.error){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=true;
                returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                returnValue.errorMessage=createRes.errorMessage;
                res.send(returnValue)
            }
            if(createRes.failed){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage=createRes.failedMessage;
                returnValue.errorMessage=null;
                res.send(returnValue)
            }
            if(createRes.successed){
                returnValue.failed=false;
                returnValue.successed=true;
                returnValue.error=false;
                returnValue.failedMessage=null;
                returnValue.errorMessage=null;
                res.send(returnValue)
            }
        }
    }catch(trycatch_err){
        returnValue.failed=true;
        returnValue.successed=false;
        returnValue.error=true;
        returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
        returnValue.errorMessage = trycatch_err.message;
        res.send(returnValue);
    }
});

app.post("/upload_prizeimage", prize.upload.single('file'), (req, res) => {
    const returnObj = {failed: null, successed: null, failedMessage: null, filename:""}
    if (!req.file) {
        returnObj.failed=true;
        returnObj.successed = false;
        returnObj.failedMessage = "Dosya işlenemedi."
    } else {
        returnObj.failed=false;
        returnObj.successed=true;
        returnObj.filename = req.file.filename.split("/")[req.file.filename.split("/").length - 1];
    }
    res.send(returnObj)
});

app.patch('/prizes/:id', async(req,res)=> {
    const requestBody = req.body;
    let result = await prize.UpdatePrize(requestBody);
    res.send(result)
})
app.patch('/prizes/:id/order', async(req,res)=> {
    const requestBody = req.body;
    if(requestBody != undefined){
        if(IsObjectContainsRequiredProps(requestBody, ["OrderOfWinning", "PrizeId"])){
            let result = await prize.UpdatePrizeOrderOfWinning(requestBody);
            res.send(result)
        }
        else res.send({"failed":true,"failedMessage":"İstenen değerler gönderilmedi."})
    }
    else res.send([]);
})
app.delete('/prizes', async(req,res)=> {
    const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
    const prizeObject = req.body;

    const requiredProps = ["PrizeName", "PrizeImage","GiveawayId","OrderOfWinning", "CountOfWinners"]
    if(!IsObjectContainsRequiredProps(prizeObject, requiredProps)){
        returnValue.failed=true;
        returnValue.successed=false;
        returnValue.error=false;
        returnValue.failedMessage="İstenen alanlar doldurulmadı.";
        res.send(returnValue);
        return;
    } 
    const result = await prize.DeletePrize(prizeObject.PrizeId);
    res.send(result)
})


const IsObjectContainsRequiredProps = (object, requiredProps) => {
    if(Object.keys(object).length){
        for(var i=0; i<requiredProps.length; i++){
            if(!Object.keys(object).includes(requiredProps[i])) return false;
        }
        return true;
    }
    return false;
}