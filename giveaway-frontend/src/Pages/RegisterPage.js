import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import RegisterForm from '../Components/RegisterForm'
import {useParams} from 'react-router-dom';
const ApiCalls = require('../ApiCalls');

function RegisterPage() {
    const [giveaway, setGiveaway] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    const api = new ApiCalls.ApiCalls();
    const GetGiveawayById = async () => {
        if(params.id)
        {
            const tempGiveaway = await api.GetGiveawayById(params.id);
            if(tempGiveaway && Object.keys(tempGiveaway).length !== 0){
                setGiveaway(tempGiveaway);
            }
            else navigate("/404");
        }
    }

    useEffect(() => {
        GetGiveawayById();
    }, [])
    return (
        <div className="registerPage-container">
            <img src="/img/highway.jpg" alt="" className='registerPage-backgroundImg'/>
            <h1 className="registerPage-title">{giveaway.Title}</h1>
            <RegisterForm giveawayId={giveaway.GiveawayId}/>
        </div>
    )
}

export default RegisterPage
