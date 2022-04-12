import React, {useState,useEffect, useRef} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import '../../css/PrizeOrderSortPage.css';
const ApiCalls = require('../../ApiCalls');
function PrizeOrderSortPage() {
  
    const [prizes, _setPrizes] = useState([]);
    const [dragStartIndex, _setDragStartIndex] = useState(-1);
    const params = useParams();
    const navigate = useNavigate();    
    

    const prizesRef = useRef(prizes);
    const setPrizes = data => {
        prizesRef.current = data;
        _setPrizes(data);
    };
    const dragStartIndexRef = useRef(dragStartIndex);
    const setDragStartIndex = data => {
        dragStartIndexRef.current = data;
        _setDragStartIndex(data);
    };
    //

    const api = new ApiCalls.ApiCalls();

    const GetGiveawayPrizes = async() => {
        const temp = await api.GetGiveawaysPrizes(params.id);
        if(temp != undefined)
        {
            if(temp.length > 0)
            {
                temp.forEach((prize) => {
                    prize["isChanged"] = false;
                })
                temp.sort((a,b) => a.OrderOfWinning - b.OrderOfWinning)
                setPrizes(temp);
            }
        }
    }

    const check = document.getElementById('check');
    const saveBtn = document.getElementById('save');



    function dragStart(e) {
        const tmp = +e.currentTarget.closest('li').getAttribute('data-index');
        console.log("tmp",tmp)
        setDragStartIndex(tmp);
    }

    function dragEnter(e) {
        setTimeout(() => {
            e.target.closest('li').classList.add('over');
        }, 5, e);
    }

    function dragLeave(e) {
        e.target.closest('li').classList.remove('over');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        const dragEndIndex = +e.currentTarget.getAttribute('data-index');
        swapItems(dragStartIndexRef.current, dragEndIndex);

        e.target.closest('li').classList.remove('over')
    }

    const swapItems = (fromIndex, toIndex) => {

        const tempPrizes = [...prizesRef.current];

        const first = +tempPrizes[fromIndex].OrderOfWinning;
        const second = +tempPrizes[toIndex].OrderOfWinning;

        tempPrizes[fromIndex].OrderOfWinning = second;
        tempPrizes[toIndex].OrderOfWinning = first;

        tempPrizes[fromIndex].isChanged = true;
        tempPrizes[toIndex].isChanged = true;

        
        setPrizes(tempPrizes);
    }

    const saveChanges = async() => {
        const tmpPrizes = [...prizesRef.current].filter(p => p.isChanged == true);
        tmpPrizes.forEach(async(prize) => {
            await api.UpdatePrizeOrderOfWinning(prize);
        })
    }

    useEffect(async() => {
        await GetGiveawayPrizes();
    }, [])
    //
  return(
    <div className="prizeOrderSortPage-container">
        <ul className="draggable-list" id="draggable-list">
        {
            prizes
            .sort((a,b) => a.OrderOfWinning - b.OrderOfWinning)
            .map((prize, index) => {
                return(
                    <li data-index={index} key={index}  onDragStart={dragStart} onDragOver={dragOver} onDrop={dragDrop} 
                        onDragEnter={dragEnter} onDragLeave={dragLeave}
                    >
                        <span className="number">{index + 1}</span>
                        <div className="draggable" draggable="true" data-id="{prize.OrderOfWinning}" data-index={index}>
                            <p className="person-name" onDragLeave={(e) => e.stopPropagation()}>{prize.PrizeName}</p>
                            <i className="fas fa-grip-lines"></i>
                            <img className='prizeOrder-img' src={`http://localhost:3001/prize_image/${prize.PrizeImage}`} alt=""/>
                        </div>
                    </li>
                )
            })
        }
        </ul>

        <button onClick={saveChanges} className="prizeOrder-saveButton">Save Changes</button>
    </div>
  );
   
}

export default PrizeOrderSortPage;
