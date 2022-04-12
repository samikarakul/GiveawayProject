export class ApiCalls{

    apiServer = "http://localhost:3001";
    CreateNewParticipant = async (participantObj) => {
        const result = await fetch(this.apiServer + "/participants", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(participantObj)
        })

        var resultJson = await result.json();
        return resultJson;
    }
    AdminLogin = async(adminObj) => {
        const result = await fetch(this.apiServer + "/login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(adminObj)
        })

        var resultJson = await result.json();
        return resultJson;
    }

    GetAllParticipants = async() => {
        const result = await fetch(this.apiServer + "/participants", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }

    GetAllGiveaways = async() => {
        const result = await fetch(this.apiServer + "/giveaways", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }
    GetGiveawayById = async(id) => {
        const result = await fetch(this.apiServer + "/giveaways/"+id, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }

    CreateGiveaway = async(giveawayObject) => {
        const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
        try{
            if(Object.keys(giveawayObject).length){
                for(var i=0; i<Object.keys(giveawayObject).length; i++){
                    if(!giveawayObject[Object.keys(giveawayObject)[i]]){
                        returnValue.failed=true;
                        returnValue.successed=false;
                        returnValue.error=false;
                        returnValue.failedMessage="Boş değer girilemez!";
                        return returnValue;
                    }
                }
            }
            const requiredProps = ["Title", "SponsorId","StartingDate","EndingDate","CoverImage"]
            if(!this.IsObjectContainsRequiredProps(giveawayObject, requiredProps)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="İstenen alanlar doldurulmadı.";
                return returnValue;
            }    
            if(isNaN(giveawayObject["SponsorId"] / 1)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="Sponsor alanı hatalı formatta girildi.";
                return returnValue;
            }

            const result = await fetch(this.apiServer + "/giveaways", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(giveawayObject)
            })

            var resultJson = await result.json();
            if(resultJson.error){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=true;
                returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                returnValue.errorMessage=resultJson.errorMessage;
                return returnValue;
            }
            if(resultJson.failed){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage=resultJson.failedMessage;
                returnValue.errorMessage=null;
                return returnValue;
            }
            if(resultJson.successed){
                returnValue.failed=false;
                returnValue.successed=true;
                returnValue.error=false;
                returnValue.failedMessage=null;
                returnValue.errorMessage=null;
                return returnValue;
            }
        }catch(trycatch_err){
            returnValue.failed=true;
            returnValue.successed=false;
            returnValue.error=true;
            returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
            returnValue.errorMessage=trycatch_err;
            return returnValue;
        }

        return returnValue;
    }

    DeleteGiveaway = async(id) => {
        var resultJson = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null}
        try{
            const giveawayObject = await this.GetGiveawayById(id)
            if(giveawayObject != undefined)
            {
                const result = await fetch(this.apiServer + "/giveaways", {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(giveawayObject)
                })
        
                resultJson = await result.json();
            }
            else{
                resultJson.failed = true;
                resultJson.successed = false;
                resultJson.error = false;
                resultJson.failedMessage = "ilgili giveaway bulunamadı.";
            }
        }catch(trycatch_err){
            resultJson.failed = true;
            resultJson.successed = false;
            resultJson.error = true;
            resultJson.failedMessage = "Beklenmeyen bir hata oluştu...";
            resultJson.errorMessage = trycatch_err.message;
        }
        
        return resultJson;
    }


    GetGiveawaysParticipants = async(id) => {
        const result = await fetch(this.apiServer + "/giveaways/"+id+"/participants", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }
    GetGiveawaysPrizes = async(id) => {
        const result = await fetch(this.apiServer + "/giveaways/"+id+"/prizes", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }
    UpdateGiveaway = async(giveawayObject) => {
        const result = await fetch(this.apiServer + "/giveaways/"+giveawayObject.giveawayId, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(giveawayObject)
        })

        var resultJson = await result.json();
        return resultJson;
    }
    
    GetAllSponsors = async() => {
        const result = await fetch(this.apiServer + "/sponsors", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }

    GetPrizeById = async(id) => {
        const result = await fetch(this.apiServer + "/prizes/"+id, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        var resultJson = await result.json();
        return resultJson;        
    }

    UpdatePrize = async(prizeObject) => {
        const result = await fetch(this.apiServer + "/prizes/"+prizeObject.prizeId, {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(prizeObject)
        })

        var resultJson = await result.json();
        return resultJson;
    }

    UpdatePrizeOrderOfWinning = async(prizeObject) => {
        const result = await fetch(this.apiServer + "/prizes/"+prizeObject.prizeId+"/order", {
            method: "PATCH",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(prizeObject)
        })

        var resultJson = await result.json();
        return resultJson;
    }

    CreatePrize = async(prizeObject) => {
        const returnValue = {failed: null, successed: null, error: null, failedMessage: null, errorMessage: null};
        try{
            if(Object.keys(prizeObject).length){
                for(var i=0; i<Object.keys(prizeObject).length; i++){
                    if(!prizeObject[Object.keys(prizeObject)[i]]){
                        returnValue.failed=true;
                        returnValue.successed=false;
                        returnValue.error=false;
                        returnValue.failedMessage="Boş değer girilemez!";
                        return returnValue;
                    }
                }
            }
            const requiredProps = ["PrizeName", "PrizeImage","GiveawayId", "CountOfWinners"]
            if(!this.IsObjectContainsRequiredProps(prizeObject, requiredProps)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="İstenen alanlar doldurulmadı.";
                return returnValue;
            }    
            if(isNaN(prizeObject["CountOfWinners"] / 1)){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage="Count of Winners alanları sayısal değer girilmek zorundadır!";
                return returnValue;
            }

            const result = await fetch(this.apiServer + "/prizes", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prizeObject)
            })

            var resultJson = await result.json();
            if(resultJson.error){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=true;
                returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
                returnValue.errorMessage=resultJson.errorMessage;
                return returnValue;
            }
            if(resultJson.failed){
                returnValue.failed=true;
                returnValue.successed=false;
                returnValue.error=false;
                returnValue.failedMessage=resultJson.failedMessage;
                returnValue.errorMessage=null;
                return returnValue;
            }
            if(resultJson.successed){
                returnValue.failed=false;
                returnValue.successed=true;
                returnValue.error=false;
                returnValue.failedMessage=null;
                returnValue.errorMessage=null;
                return returnValue;
            }
        }catch(trycatch_err){
            returnValue.failed=true;
            returnValue.successed=false;
            returnValue.error=true;
            returnValue.failedMessage="Beklenmeyen bir hata oluştu...";
            returnValue.errorMessage=trycatch_err;
            return returnValue;
        }

        return returnValue;
    }

    DeletePrize = async(id) => {
        const prizeObject = await this.GetPrizeById(id)
        const result = await fetch(this.apiServer + "/prizes", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prizeObject)
        })

        var resultJson = await result.json();
        return resultJson;
    }

    IsObjectContainsRequiredProps = (object, requiredProps) => {
        if(Object.keys(object).length){
            for(var i=0; i<requiredProps.length; i++){
                if(!Object.keys(object).includes(requiredProps[i])) return false;
            }
            return true;
        }
        return false;
    }
}