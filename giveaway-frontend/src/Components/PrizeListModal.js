import React, {useState, useEffect, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom';
import '../css/PrizeListModal.css';
const ApiCalls = require('../ApiCalls');

function PrizeListModal({isModalHide, HideOrShowPrizeListModal}) {
    const [prizes, _setPrizes] = useState([]);
    const api = new ApiCalls.ApiCalls();
    const params = useParams();
    const navigate = useNavigate();

    const prizesRef = useRef(prizes);
    const setPrizes = data => {
        prizesRef.current = data;
        _setPrizes(data);
    };

    var prizeModalDiv = document.getElementById("prizeListModalContainer");
    if(prizeModalDiv){
        isModalHide ? prizeModalDiv.classList.add("hide") : prizeModalDiv.classList.remove("hide");
    }

    const GetGiveawaysPrizes = async() => {
        if(params.id)
        {
            const tempPrizes = await api.GetGiveawaysPrizes(params.id);
            if(tempPrizes != undefined) setPrizes(tempPrizes);
        }
        else navigate("/404");
    }

    const HidePrizeListModal = () => {
        HideOrShowPrizeListModal();
    }
    useEffect(() => {
        GetGiveawaysPrizes();
    }, [])

    const EmptyListDiv = () => {
        if(!prizesRef.current.length){
            return(
                <div className="emptyList">
                    <p>Henüz ödüller açıklanmadı!</p>
                </div>
            )
        }
        return(<div></div>)
    }
    return (
        <div className='prizeListModal-container hide' id="prizeListModalContainer">
            <div className='prizeListModal-gray' onClick={HidePrizeListModal}></div>
            <div className='prizeList'>
                <EmptyListDiv/>
                {
                    prizes.map((prize, index) => {
                        return(
                            <div key={index} className='prizeCard'>
                                <p>{prize.CountOfWinners} {prize.CountOfWinners == 1 ? "participant" : "participants"} will get {prize.PrizeName}</p>
                                <img src={`http://localhost:3001/prize_image/${prize.PrizeImage}`}  className="prizeCardImg" alt=""/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PrizeListModal
