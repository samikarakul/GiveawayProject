import React from 'react';
import '../css/RegisterSuccessed.css';

function RegisterSuccessed({isSuccessed, userFullName}) {
    return (
        <div className={!isSuccessed ? "registerSuccessedDiv hide" : "registerSuccessedDiv"}>
            <h1>Thank You!</h1>
            <h2>Dear {userFullName},</h2>
            <h3>Your registration for giveaway has successfully completed!</h3>
            <h3>We wish you best of luck!</h3>
        </div>
    )
}

export default RegisterSuccessed
