import React, {useState, useEffect} from 'react'
import Giveaway from '../Components/Giveaway';
import '../App.css';
const ApiCalls = require('../ApiCalls');

function Home() {
    const [giveaways, setGiveaways] = useState([]);

    useEffect(() => {
        GetAllGiveaways();
    }, [])

    const api = new ApiCalls.ApiCalls();
    const GetAllGiveaways = async () => {
        const tempGiveaways = await api.GetAllGiveaways();
        if(tempGiveaways) setGiveaways(tempGiveaways);
    }
    return (
        <div className='home-container'>
            {
                giveaways.map((giveaway) => (
                    <Giveaway 
                        key={giveaway.GiveawayId}
                        giveaway={giveaway}
                    />
                ))
            }
        </div>
    )
}

export default Home