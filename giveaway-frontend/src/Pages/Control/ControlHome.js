import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import '../../css/ControlHome.css';
import LoginFailMessage from '../../Components/Control/LoginFailMessage';
const ApiCalls = require('../../ApiCalls');

function ControlHome({loginState, setLoginState}) {

    const [loginResponseObj, setLoginResponseObj] = useState({}) 
    let navigate = useNavigate();

    const formSubmitted = async (event) => {
        event.preventDefault();
        let resObj = {failed: false, successed: false, error: null, failedMessage: null};
        if(event && event.target && event.target.elements["username"] && event.target.elements["password"])
        {
            if(event.target.elements["username"].value && event.target.elements["password"].value)
            {
                const adminObject = {"username": event.target.elements["username"].value, "password":event.target.elements["password"].value}
                const api = new ApiCalls.ApiCalls();
                const adminLoginResponse = await api.AdminLogin(adminObject);
                if(adminLoginResponse) resObj = adminLoginResponse;
            }
            else{
                resObj.failed=true;
                resObj.failedMessage="Lütfen gerekli alanları doldurun.";
            };
        }
        setLoginResponseObj(resObj);

        if(resObj.successed){
            document.cookie = 'username=admin;'
            setLoginState(document.cookie)
            navigate("/");
        }
    }

    return (
        <div className='controlHome-container'>
            <h1>Login</h1>
            <form onSubmit={formSubmitted} method="post" className='controlHome-form'>
                <input name="username" placeholder='Please enter your username...' className='hm'/>
                <input name="password" placeholder='Please enter your password...' type="password"/>
                <button><span>Login</span></button>
            </form>
            <LoginFailMessage loginResponseObj={loginResponseObj}/>

        </div>
    )
}

export default ControlHome
