import React from 'react';
import '../../css/DeleteConfirmModal.css';
function DeleteConfirmModal({isConfirmHide, HideConfirmModal, ConfirmDelete}) {

    var deleteConfirmModalDiv = document.getElementById("deleteConfirmModal");
    if(deleteConfirmModalDiv){
        isConfirmHide ? deleteConfirmModalDiv.classList.add("hide") : deleteConfirmModalDiv.classList.remove("hide");
    }

    const ConfirmYesClicked = () => {
        HideConfirmModal();
        ConfirmDelete();
    }
    return (
        <div className='deleteConfirmModal-container hide' id="deleteConfirmModal">
            <div className="confirmGray"></div>
            <div className='confirmWhite'>
                <img src="s" alt=""/>
                <h1>Are you sure you want to delete?</h1>
                <div className='confirmButtons'>
                    <button id="confirmButton-yes" onClick={ConfirmYesClicked}>Yes</button>
                    <button id="confirmButton-no" onClick={HideConfirmModal}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
