import React, {useState, useEffect} from 'react'
import Participant from '../Participant/Participant';
const ApiCalls = require('../../ApiCalls');


function ParticipantList() {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        GetAllParticipants();
    }, [])

    const api = new ApiCalls.ApiCalls();
    const GetAllParticipants = async() => {
        const tempParticipants = await api.GetAllParticipants();
        if(tempParticipants) setParticipants(tempParticipants);
    }
    return (
        <div>
            <h1>Participant List</h1>
            {
                participants.map((participant, index) => (
                    <Participant key={index + 1} participant={participant}/>
                ))
            }
        </div>
    )
}

export default ParticipantList
