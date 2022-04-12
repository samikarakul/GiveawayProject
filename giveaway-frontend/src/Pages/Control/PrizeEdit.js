import React, {useState,useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import '../../css/GiveawayEditPage.css';
import ImageFullsizeModal from '../../Components/Control/ImageFullsizeModal';
import EditNotification from '../../Components/Control/EditNotification';
const ApiCalls = require('../../ApiCalls');

function PrizeEdit() {
    const [prize, setPrize] = useState({PrizeName:'', PrizeImage:'', GiveawayId:-1, CountOfWinners:1});
    const [file, setFile] = useState();
    const [isFullsize, setIsFullsize] = useState(false);
    const [fullsizeShowMethod, setFullsizeShowMethod] = useState(0);
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    const api = new ApiCalls.ApiCalls();

    const GetPrizeById = async () => {
        if(params.id)
        {
            const tempPrize = await api.GetPrizeById(params.id);
            console.log(tempPrize)
            if(tempPrize && Object.keys(tempPrize).length !== 0){
                setPrize(tempPrize);
            }
            else navigate("/404");
        }
    }

    //
    const prizeEditFormSubmit = async(e) => {
        e.preventDefault();
        if(file){
            const formData = new FormData();
            console.log(file);
            formData.append("file", file, "test.jpg");
            console.log(formData.get("file"))
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
            } catch (ex) {
              console.log(ex);
            }
        }
        
        const updateResult = await api.UpdatePrize(prize);
        if(updateResult){
            if(updateResult.err){
                setIsHide(false)
                setNotificationMessage("Update could not be performed...")
            }
            else{
                setIsHide(false)
                setNotificationMessage("Update successfully performed.")
            }
        }
        else{
            setIsHide(false)
            setNotificationMessage("Update could not be performed...")
        }
    }

    const inputChangedHandler_PrizeName = (e) => {
        if(e && e.target.value){
            setPrize(prevPrize => ({
                ...prevPrize,
                PrizeName: e.target.value
            }));
        }
        else{
            setIsHide(false);
            setNotificationMessage("Prize Name field must to be filled");
        }
    }

 
    const inputChangedHandler_CountOfWinners = (e) => {
        if(e && e.target.value){

            if(e.target.value < 1) {
                setIsHide(false);
                setNotificationMessage("Count of Winners value can not be less than 1");                                
                return;
            }

            setPrize(prevPrize => ({
                ...prevPrize,
                CountOfWinners: Number(e.target.value)
            }));
        }
        else{
            setIsHide(false);
            setNotificationMessage("Count of Winners field must to be filled");
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
    //
    useEffect(() => {
        if(document.cookie.length == 0){
            navigate("/")
        }
        GetPrizeById();
    }, [])
    

    return (
        <div className='giveawayEdit-container'>
            <EditNotification isHide = {isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <div className='editForm-containerDiv'>
                <ImageFullsizeModal img={file} isFullsize={isFullsize} 
                    showMethod={fullsizeShowMethod} imageName={prize.PrizeImage}
                    closeFullSize={closeFullSize} imageSource="prize_image"
                />
                <form method="post" className="giveawayEdit-form" onSubmit={e => prizeEditFormSubmit(e)}>
                    <input name="prizeName" value={prize.PrizeName} onChange={(e) => inputChangedHandler_PrizeName(e) } />
                    <input name="CountOfWinners" type="number" value={prize.CountOfWinners} onChange={(e) => inputChangedHandler_CountOfWinners(e) }/>
                    <span className='fileSpan' onClick={() => { document.getElementById("prizeImage").click() }}>Choose a File</span>
                    <input name="prizeImage" id="prizeImage" type='file' onChange={(e) => inputChangedHandler_prizeImage(e)}/>

                    <button>Save Changes</button>
                </form>
                
                <div className="imageWrapDiv"
                    onClick={() => {setIsFullsize(true)}}
                >
                    <img src={prize.PrizeImage ? `http://localhost:3001/prize_image/${prize.PrizeImage}` : `http://localhost:3001/prize_image/highway.jpg`} alt="" id="prizeImage_preview"/>
                    <div className="imageWrap">
                        Click To Full Size
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default PrizeEdit
