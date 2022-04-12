import React from 'react';
import {Link} from 'react-router-dom';
import '../css/Giveaway.css';

function Giveaway(giveawayProp) {

    const giveaway = giveawayProp.giveaway;
    const imagePath = "/img/" +  giveaway.CoverImage;


    const CalculateRemainingDays = () => {
        
        const diff = new Date(giveaway.EndingDate.split("-").reverse().join("-")) - new Date();
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24)); 
        giveaway.RemainingDayNotification = diffDays;
    }

    const daysLeft = CalculateRemainingDays();


    return (
        <div className='giveaway-container'>
            <h1>Giveaway Ends {giveaway.RemainingDayNotification == 1 ? "Today" : `in ${giveaway.RemainingDayNotification} days`}!</h1>
            <img src={`http://localhost:3001/image/${giveaway.CoverImage}`} alt="" id="coverImage_preview"/>
            <Link to={`/giveaways/${giveaway.GiveawayId}`}>
            <button>See Details</button>
            </Link>
            
        </div>
    )
}

export default Giveaway
