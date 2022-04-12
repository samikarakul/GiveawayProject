import React from 'react';
import '../../css/LoginFailMessage.css';
function LoginFailMessage(props) {
    return (
        <div className={props.loginResponseObj.failed ? "loginFailMessage-container" : "hide"}>
            <span><img src="/img/warning-icon.jpg" alt=""/></span>
            <h3>{props.loginResponseObj.failedMessage}</h3>
        </div>
    )
}

export default LoginFailMessage
