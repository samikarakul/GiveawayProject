import React from 'react'

function Participant({participant}) {
    return (
        <div>
            <h1>{participant.FirstName} {participant.LastName}</h1>
            <h1>{participant.Email}</h1>
        </div>
    )
}

export default Participant
