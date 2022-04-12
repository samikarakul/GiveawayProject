import React, {useState} from 'react';
import ImageFullsizeModal from './ImageFullsizeModal';
import EditNotification from './EditNotification';
import '../../css/NewPrizeModal.css';
const ApiCalls = require('../../ApiCalls');

function NewPrizeModal({isPrizeModalHidden, HideOrShowPrizeModal, giveawayId}) {
    const [prize, setPrize] = useState({PrizeName:'denemeDefault', PrizeImage:'', GiveawayId:giveawayId, CountOfWinners:1});
    const [file, setFile] = useState();
    const [isFullsize, setIsFullsize] = useState(false);
    const [fullsizeShowMethod, setFullsizeShowMethod] = useState(0);
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");

    const api = new ApiCalls.ApiCalls();

    const HideModal = () => {
        HideOrShowPrizeModal(true);
    }

    var prizeModalDiv = document.getElementById("newPrizeModal");
    if(prizeModalDiv){
        isPrizeModalHidden ? prizeModalDiv.classList.add("hide") : prizeModalDiv.classList.remove("hide");
    }

    if(!giveawayId){
        console.log(giveawayId)
        if(prizeModalDiv){
            prizeModalDiv.classList.add("hide");
            HideModal();
        }
    }
    

    const inputChangedHandler_prizeImage = (e) => {
        if(e && e.target.value){
            var reader = new FileReader();

            reader.onload = function (x) {
                const previewElement = document.getElementById("prizeImage_preview");
                previewElement.src = x.target.result;
            }
            
            reader.readAsDataURL(e.target.files[0]);
            setFile(e.target.files[0]);
            setFullsizeShowMethod(1);
        }
    }

    const closeFullSize = () => {
        setIsFullsize(false)
    }

    const NewPrizeFormSubmitted = async(e) => {
        e.preventDefault();
        if(e && e.target && e.target.elements.length){
            IsInputsValid(e.target.elements)
            if(e.target.elements["countOfWinners"]){
                const sonuc = IsValuesConvertibleToNumber([e.target.elements["countOfWinners"].value])
            }
        }

        if(file){
            const formData = new FormData();
            formData.append("file", file, "test.jpg");
            try {
                const result = await fetch("http://localhost:3001/upload_prizeimage", {
                    method: "POST",
                    headers: {
                        // 'Content-Type': 'multipart/form-data'
                      },
                    body: formData
                })
        
                var resultJson = await result.json();
                if(resultJson && resultJson.successed)
                {
                    if(resultJson.filename)
                    {
                        prize.PrizeImage = resultJson.filename;
                        
                    }
                }
                console.log(resultJson)
            } catch (ex) {
              console.log(ex);
            }
        }
        
        prize.PrizeName = e.target.elements["prizeName"].value;
        const createResult = await api.CreatePrize(prize);
        console.log("createRes -> ",createResult)
        if(createResult != undefined){
            if(createResult.error || createResult.failed){
                setIsHide(false)
                setNotificationMessage(createResult.failedMessage)
            }
            else if(createResult.successed){
                setIsHide(false)
                setNotificationMessage("Create successfully performed.")
            }
        }
        else{
            setIsHide(false)
            setNotificationMessage("Create could not be performed...")
        }

    }

    const IsInputsValid = (formElements) => {
        for(var i=0; i<formElements.length; i++){
            if(formElements[i].type != "submit" && !formElements[i].value) return false;
        }
        return true;
    }

    const IsValuesConvertibleToNumber = (values) => {
        try{
            for(var i=0; i<values.length; i++){
                if(isNaN(values[i] / 1)) return false;
            }
        }catch(err){
            return false;
        }

        return true;
    }
    return (
        <div className='newPrizeModal-container hide' id="newPrizeModal">
            <EditNotification isHide = {isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <ImageFullsizeModal img={file} isFullsize={isFullsize} 
                showMethod={fullsizeShowMethod} imageName={prize.PrizeImage}
                closeFullSize={closeFullSize} imageSource="prize_image"/>
            <div className='newPrizeModal-grayArea'></div>
            <div className='newPrizeModal-formContainer'>
                <span className="closeModal-span" onClick={HideModal}>X</span>
                <form method="post" className='newPrizeModal-form' onSubmit={NewPrizeFormSubmitted}>
                    <label for="prizeName">Prize Name:</label>
                    <input name="prizeName" id="prizeName" type="text"/>
                    <div className='newPrizeModal-numberInputs'>
                        
                        <div>
                            <label for="countOfWinners">Count of Winners:</label>
                            <input name="countOfWinners" id="countOfWinners" type="number"/>
                        </div>
                    </div>
                    <span className='fileSpan' onClick={() => { document.getElementById("prizeImage").click() }}>Choose a File</span>
                    <input name="prizeImage" id="prizeImage" type='file' onChange={(e) => inputChangedHandler_prizeImage(e)}/>
                    <button>Add</button>
                </form>

                <div className="NewPrizeimageWrapDiv"
                    onClick={() => {setIsFullsize(true)}}
                >
                    <img src="s" alt="" id="prizeImage_preview"/>
                    <div className="NewPrizeimageWrap">
                        Click To Full Size
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPrizeModal
