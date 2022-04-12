import React, {useState,useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import '../../css/GiveawayEditPage.css';
import ImageFullsizeModal from '../../Components/Control/ImageFullsizeModal';
import EditNotification from '../../Components/Control/EditNotification';
const ApiCalls = require('../../ApiCalls');

function GiveawayEdit() {
    const [giveaway, setGiveaway] = useState({Title:'', SponsorId:-1, StartingDate:'', EndingDate:'', CoverImage:''});
    const [sponsors, setSponsors] = useState([])
    const [file, setFile] = useState();
    const [isFullsize, setIsFullsize] = useState(false);
    const [fullsizeShowMethod, setFullsizeShowMethod] = useState(0);
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    const api = new ApiCalls.ApiCalls();
    const GetGiveawayById = async () => {
        if(params.id)
        {
            const tempGiveaway = await api.GetGiveawayById(params.id);
            if(tempGiveaway && Object.keys(tempGiveaway).length !== 0){
                tempGiveaway.StartingDate = tempGiveaway.StartingDate.split("-").reverse().join("-");
                tempGiveaway.EndingDate = tempGiveaway.EndingDate.split("-").reverse().join("-");
                setGiveaway(tempGiveaway);
            }
            else navigate("/404");
        }
    }

    const GetAllSponsors = async() => {
        const tempSponsors = await api.GetAllSponsors(params.id);
        if(tempSponsors && tempSponsors.length !== 0){
            setSponsors(tempSponsors);
        }
    }

    const giveawayEditFormSubmit = async(e) => {
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
                console.log(resultJson)
            } catch (ex) {
              console.log(ex);
            }
        }
        
        const updateResult = await api.UpdateGiveaway(giveaway);
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

    const inputChangedHandler_Title = (e) => {
        if(e && e.target.value){
            setGiveaway(prevGiveaway => ({
                ...prevGiveaway,
                Title: e.target.value
            }));
        }
        else{
            setIsHide(false);
            setNotificationMessage("Title field must to be filled");
        }
    }


    const inputChangedHandler_StartingDate = (e) => {
        let newDate = giveaway.StartingDate;
        if(giveaway.EndingDate)
        {
            let dateChanged = false;
            if(new Date(giveaway.EndingDate).getTime() > new Date(e.target.value).getTime())
            {
                dateChanged = true;
                newDate = e.target.value;
            }

            if(!dateChanged){
                setIsHide(false);
                setNotificationMessage("Starting Date can not be later than Ending Date!")
            }
        }
        setGiveaway(prevGiveaway => ({
                ...prevGiveaway,
                StartingDate: newDate
        }))
    }
    const inputChangedHandler_EndingDate = (e) => {
        let newDate = giveaway.EndingDate;
        if(e && e.target.value){
            if(giveaway.StartingDate)
            {
                let dateChanged = false;
                if(new Date(giveaway.StartingDate).getTime() < new Date(e.target.value).getTime())
                {
                    dateChanged = true;
                    newDate = e.target.value;
                }

                if(!dateChanged){
                    setIsHide(false);
                    setNotificationMessage("Ending Date can not be earlier than Starting Date")
                }
            }
            setGiveaway(prevGiveaway => ({
                ...prevGiveaway,
                EndingDate: newDate
            }));
        }
    }
    const inputChangedHandler_CoverImage = (e) => {
        if(e && e.target.value){
            var reader = new FileReader();

            reader.onload = function (x) {
                const previewElement = document.getElementById("coverImage_preview");
                previewElement.src = x.target.result;
            }
            
            reader.readAsDataURL(e.target.files[0]);
            setFile(e.target.files[0]);
            setFullsizeShowMethod(1);
        }
    }

    useEffect(() => {
        if(document.cookie.length == 0){
            navigate("/")
        }
        GetGiveawayById();
        GetAllSponsors();
    }, [])

    const closeFullSize = () => {
        setIsFullsize(false)
    }
    return (
        <div className='giveawayEdit-container'>
            <EditNotification isHide = {isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <div className='editForm-containerDiv'>
                <ImageFullsizeModal img={file} isFullsize={isFullsize} 
                    showMethod={fullsizeShowMethod} imageName={giveaway.CoverImage}
                    closeFullSize={closeFullSize} imageSource="image"/>
                <form method="post" className="giveawayEdit-form" onSubmit={e => giveawayEditFormSubmit(e)}>
                    <input name="title" value={giveaway.Title} onChange={(e) => inputChangedHandler_Title(e) } />
                    <select value={giveaway.SponsorId} onChange={(e) => setGiveaway(prevGiveaway => ({ ...prevGiveaway, SponsorId: e.target.value }))}>
                        {
                            sponsors.map((sponsor) => (
                                <option key={sponsor.SponsorId} value={sponsor.SponsorId}>
                                    {sponsor.SponsorCompanyName}
                                </option>
                            ))
                        }
                    </select>
                    <input name="startingDate" type="date" value={giveaway.StartingDate} onChange={(e) => inputChangedHandler_StartingDate(e) }/>
                    <input name="endingDate" type="date" value={giveaway.EndingDate} onChange={(e) => inputChangedHandler_EndingDate(e) }/>
                    <span className='fileSpan' onClick={() => { document.getElementById("coverImage").click() }}>Choose a File</span>
                    <input name="coverImage" id="coverImage" type='file' onChange={(e) => inputChangedHandler_CoverImage(e)}/>

                    <button>Save Changes</button>
                </form>
                
                <div className="imageWrapDiv"
                    onClick={() => {setIsFullsize(true)}}
                >
                    <img src={`http://localhost:3001/image/${giveaway.CoverImage}`} alt="" id="coverImage_preview"/>
                    <div className="imageWrap">
                        Click To Full Size
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default GiveawayEdit
