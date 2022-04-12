import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import {useParams, useNavigate} from 'react-router-dom';
const ApiCalls = require('../../ApiCalls');
function GiveawaysParticipantList() {
    const [participants, setParticipants] = useState([]);

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        GetGiveawaysParticipants();
    }, [])

    const api = new ApiCalls.ApiCalls();
    const GetGiveawaysParticipants = async () => {
        if(params.id){
            console.log(params.id)
            const tempGiveaways = await api.GetGiveawaysParticipants(params.id);
            console.log(tempGiveaways);
            if(tempGiveaways) {
                setParticipants(tempGiveaways);
            }
        }
        else navigate("/404");
    }

    return (
        <div className='tableContainer tableList-container'>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                    </tr>
                </thead>
            
                <tbody>
                {
                    participants.map((participant,index) => {
                        return(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{participant.FirstName}</td>
                                <td>{participant.LastName}</td>
                                <td>{participant.Email}</td>
                                <td className="td-button">
                                    <Link to={`/control/giveaways/participants/${participant.ParticipantId}/edit`}>
                                        Edit
                                    </Link>
                                </td>
                                <td className="td-button">Show Previous Giveaways</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default GiveawaysParticipantList
