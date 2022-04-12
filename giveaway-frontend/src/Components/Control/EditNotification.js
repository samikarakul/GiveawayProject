import React from 'react';
import '../../css/GiveawayEditNotification.css';
function GiveawayEditNotification({isHide, notificationMessage, setIsHide}) {

    if(notificationMessage != ""){
        const editNotificationDivs = document.getElementsByClassName("editNotification-container");
        if(editNotificationDivs.length >0){
            editNotificationDivs[0].classList.add("somePadding")
        }

        console.log("hm")
    }
    if(!isHide){
        setTimeout(() => {
            const showAnimationDivs = document.getElementsByClassName("showAnimation");
            for(var i=0; i<showAnimationDivs.length; i++)
            {
                showAnimationDivs[i].classList.remove("showAnimation");
            }

            setIsHide(true)
        }, 6000)
        const showAnimationDivs = document.getElementsByClassName("editNotification-container");
        for(var i=0; i<showAnimationDivs.length; i++)
        {
            showAnimationDivs[i].classList.add("showAnimation");
        }        
    }
    return (
        <div className="editNotification-container">
            <p>{notificationMessage}</p>
        </div>
    )
}

export default GiveawayEditNotification
