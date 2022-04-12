import React from 'react'

function NewPrizeModalOpenButton({HideOrShowModal, isModalHidden, buttonText}) {
    const ShowModal = () => {
        HideOrShowModal(false);
    }

    const newPrizeOpenButton  = document.getElementById("newPrizeOpenButton");
    if(newPrizeOpenButton) {
        if(!isModalHidden){
            newPrizeOpenButton.classList.add("buttonZindex")
        }
        else newPrizeOpenButton.classList.remove("buttonZindex")
    }

    return (
        <div>
            <button className='newPrizeModal-openButton' onClick={() => ShowModal()} id="newPrizeOpenButton">{buttonText}</button>
        </div>
    )
}

export default NewPrizeModalOpenButton
