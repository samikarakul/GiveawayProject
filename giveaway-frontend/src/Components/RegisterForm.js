import React, {useState, useEffect} from 'react'
import RegisterButton from './RegisterButton';
import RegisterSuccessed from './RegisterSuccessed';
import '../css/RegisterPage.css';
const ApiCalls = require('../ApiCalls');


function RegisterForm({giveawayId}) {
    const [isFailed, setIsFailed] = useState(false);
    const [isSuccessed, setIsSuccessed] = useState(false);
    const [failMessage, setFailMessage] = useState("");
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        if(isFailed){
            AddAndRemoveErrorClassForAnimation();
        }
    }, [isFailed]);

    const formSubmitted = async (event) => {
        if(event){
            event.preventDefault();
            return;
        } 
           
        const form = document.getElementsByClassName("registerForm-form")[0];
        if(form)
        {
            const isFormValuesNullOrEmpty = CheckFormValuesNullOrEmpty(form.elements);
            const isEmailValid = isFormValuesNullOrEmpty ? CheckEmailValid(form.elements["email"]) : false;
            if(isFormValuesNullOrEmpty && isEmailValid)
            {
                const participantObj = CreateParticipantObject(form.elements);
                const api = new ApiCalls.ApiCalls();
                if(participantObj){
                    const createParticipantRes = await api.CreateNewParticipant(participantObj);
                    if(createParticipantRes && createParticipantRes.failed)
                    {
                        setIsFailed(createParticipantRes.failed);
                        setFailMessage(createParticipantRes.message);

                    }
                    if(createParticipantRes && createParticipantRes.successed)
                    {
                        setIsSuccessed(true);
                        const user_fullname = form.elements["firstName"].value + " " + form.elements["lastName"].value;
                        if(form.elements["firstName"] && form.elements["lastName"]){
                            setFullName(user_fullname);
                        }
                    }
                } 
                
            }
        }
        else console.log("not valid");

        if(isFailed) 
        {
            AddAndRemoveErrorClassForAnimation();
        }


    }


    const CheckFormValuesNullOrEmpty = (formElements) => {
        if(!formElements) return false;
        for(let i=0; i<formElements.length; i++)
        {
            if(formElements[i].type === "text")
            {
                if(!formElements[i].value) return false;
            }
        }
        return true;
    }

    const CheckEmailValid = (emailElement) => {
        if(!emailElement || !emailElement.value) return false;
        if(emailElement.value.includes("@")) return true;
        return false;
    }

    const CreateParticipantObject = (formElements) => {
        console.log("returnobj")
        let returnObject = {}
        returnObject["firstName"] = formElements["firstName"].value;
        returnObject["lastName"] = formElements["lastName"].value;
        returnObject["email"] = formElements["email"].value;
        returnObject["giveawayId"] = giveawayId;

        return returnObject;
    }

    const AddAndRemoveErrorClassForAnimation = () => {
        const registerFormDiv = document.getElementsByClassName("registerFormDiv");
        if(registerFormDiv)
        {
            registerFormDiv[0].classList.add("error-div");
            setTimeout(() => {
                registerFormDiv[0].classList.remove("error-div");
            }, 500);
        }
    }

    return (
        <div className='registerFormContainer'>
            <RegisterSuccessed isSuccessed={isSuccessed} userFullName={fullName}/>
            <div className={isSuccessed ? "registerFormDiv hideForm" : "registerFormDiv"}>
                <span className={!isFailed ? "errorMsg hide" : "errorMsg"}>{failMessage}</span>
                <form method="post" onSubmit={formSubmitted} className="registerForm-form">
                    <input name="firstName" placeholder="Please enter your first name..."/>
                    <input name="lastName" placeholder="Please enter your last name..."/>
                    <input name="email" placeholder="Please enter your email address.."/>
                    <RegisterButton formSubmitted={formSubmitted}/>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
