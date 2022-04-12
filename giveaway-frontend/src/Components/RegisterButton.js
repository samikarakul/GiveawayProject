import React from 'react';
import '../css/RegisterButton.css';

function RegisterButton({formSubmitted}) {

    const registerButtonClicked = () => {
        formSubmitted();
    }

    return (
        <div className='registerButton' onClick={registerButtonClicked}>
            <span><b>Register</b></span>
            <img src="/img/wheel.png" alt="wheel" className="wheel-img"/>
        </div>
    )
}

export default RegisterButton
