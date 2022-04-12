import React, {useState, useEffect} from 'react'
import ImageFullsizeModal from './ImageFullsizeModal';
import EditNotification from './EditNotification';
import '../../css/NewPrizeModal.css';
const ApiCalls = require('../../ApiCalls');
    
function NewGiveawayModal({isModalHidden, HideOrShowModal}) {
    const [giveaway, setGiveaway] = useState({Title:'denemeDefault', SponsorId:-1, StartingDate:Date.now(), EndingDate: Date.now(), CoverImage:""});
    const [sponsors, setSponsors] = useState([])
    const [file, setFile] = useState();
    const [isFullsize, setIsFullsize] = useState(false);
    const [fullsizeShowMethod, setFullsizeShowMethod] = useState(0);
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");


    const api = new ApiCalls.ApiCalls();
    
    const GetAllSponsors = async() => {
        const tempSponsors = await api.GetAllSponsors();
        if(tempSponsors && tempSponsors.length !== 0){
            setSponsors(tempSponsors);
        }
    }

    var prizeModalDiv = document.getElementById("newPrizeModal");
    if(prizeModalDiv){
        isModalHidden ? prizeModalDiv.classList.add("hide") : prizeModalDiv.classList.remove("hide");
    }

    const HideModal = () => {
        HideOrShowModal(true);
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

        if(file){
            const formData = new FormData();
            formData.append("file", file, "test.jpg");
            try {
                const result = await fetch("http://localhost:3001/upload", {
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
                        giveaway.CoverImage = resultJson.filename;
                        
                    }
                }
            } catch (ex) {
              console.log(ex);
            }
        }
        
        giveaway.Title = e.target.elements["title"].value;
        giveaway.StartingDate = e.target.elements["startingDate"].value;
        giveaway.EndingDate = e.target.elements["endingDate"].value;
        
        if(new Date(giveaway.EndingDate).getTime() < new Date(giveaway.StartingDate).getTime())
        {
            setIsHide(false);
            setNotificationMessage("Starting Date can not be later than Ending Date!")
            return;            
        }
        const createResult = await api.CreateGiveaway(giveaway);
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


    useEffect(() => {
        GetAllSponsors();
    }, [])

    useEffect(() => {
        if(sponsors && sponsors.length){
            if(sponsors[0] && Object.keys(sponsors[0]).includes("SponsorId")) setGiveaway(prevGiveaway => ({ ...prevGiveaway, SponsorId: sponsors[0].SponsorId }))
        }
    }, [sponsors])
    return (
        <div className='newPrizeModal-container hide' id="newPrizeModal">
            <EditNotification isHide = {isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <ImageFullsizeModal img={file} isFullsize={isFullsize} 
                showMethod={fullsizeShowMethod} imageName={giveaway.CoverImage}
                closeFullSize={closeFullSize} imageSource="img"/>
            <div className='newPrizeModal-grayArea'></div>
            <div className='newPrizeModal-formContainer'>
                <span className="closeModal-span" onClick={HideModal}>X</span>
                <form method="post" className='newPrizeModal-form' onSubmit={NewPrizeFormSubmitted}>
                    <label for="title">Title:</label>
                    <input name="title" id="title" type="text"/>
                    <select value={giveaway.SponsorId} onChange={(e) => setGiveaway(prevGiveaway => ({ ...prevGiveaway, SponsorId: e.target.value }))}>
                        {
                            sponsors.map((sponsor) => (
                                <option key={sponsor.SponsorId} value={sponsor.SponsorId}>
                                    {sponsor.SponsorCompanyName}
                                </option>
                            ))
                        }
                    </select>
                    <div className='newPrizeModal-numberInputs'>
                        <div>
                            <label for="startingDate">Starting Date:</label>
                            <input name="startingDate" id="startingDate" type="date"/>
                        </div>
                        <div>
                            <label for="endingDate">Ending Date:</label>
                            <input name="endingDate" id="endingDate" type="date"/>
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

export default NewGiveawayModal

