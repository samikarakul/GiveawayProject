import React, {useState,useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import PrizeListModal from '../Components/PrizeListModal';
import '../css/GiveawayDetails.css';
const ApiCalls = require("../ApiCalls");
function GiveawayDetails() {
    const [giveaway, setGiveaway] = useState({Title:'', SponsorId:-1, StartingDate:'', EndingDate:'', CoverImage:'', RemainingDayNotification: ''});
    const [isModalHide, setIsModalHide] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    const api = new ApiCalls.ApiCalls();
    const GetGiveawayById = async () => {
        if(params.id)
        {
            const tempGiveaway = await api.GetGiveawayById(params.id);
            if(tempGiveaway && Object.keys(tempGiveaway).length !== 0){
                tempGiveaway.RemainingDayNotification = CalculateRemainingDays(tempGiveaway.EndingDate);
                setGiveaway(tempGiveaway);
            }
            else navigate("/404");
        }
        else navigate("/404");
    }
    const CalculateRemainingDays = (endingDate) => {
        const diff = new Date(endingDate.split("-").reverse().join("-")) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24)); 
    }

    const HideOrShowPrizeListModal = () => {
        setIsModalHide(prevValue => !prevValue);
    }
    useEffect(() => {
        GetGiveawayById();
    }, [])

    return (
        <div className='giveawayDetails-container'>
            <div className='giveawayDetails-background'></div>
            <PrizeListModal isModalHide={isModalHide} HideOrShowPrizeListModal={HideOrShowPrizeListModal}/>
            <div className="giveawayDetails-white">
                <h1>{giveaway.Title}</h1>
                <img src={`http://localhost:3001/image/${giveaway.CoverImage}`} alt=""/>
                <button className={giveaway.RemainingDayNotification <= 0 ? "prizesShowButton hide" : "prizesShowButton"} onClick={HideOrShowPrizeListModal}>Show Prizes</button>

                <Link to={`/register/${giveaway.GiveawayId}`} className={giveaway.RemainingDayNotification <= 0 ? "registerButton hide" : "registerButton"}>
                    <button>Register Now!!</button>
                </Link>
                <h3 className={giveaway.RemainingDayNotification <= 0 ? "hide" : ""}>Giveaway Ends {giveaway.RemainingDayNotification == 1 ? "Today" : `in ${giveaway.RemainingDayNotification} days`}!</h3>
                <h3 className={giveaway.RemainingDayNotification > 0 ? "hide": ""}>Giveaway Ended {giveaway.EndingDate}</h3>
            </div>

        </div>
    )
}

export default GiveawayDetails
