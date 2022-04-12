import React, {useState, useEffect} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import NewPrizeModalOpenButton from '../../Components/Control/NewPrizeModalOpenButton';
import NewPrizeModal from '../../Components/Control/NewPrizeModal';
import DeleteConfirmModal from '../../Components/Control/DeleteConfirmModal';
import EditNotification from '../../Components/Control/EditNotification';
import '../../css/PrizeListPage.css';
const ApiCalls = require('../../ApiCalls');

function GiveawaysPrizeList() {
    const [prizes, setPrizes] = useState([]);
    const [isModalHidden, setIsModalHidden] = useState(true);
    const [isConfirmHide, setIsConfirmHide] = useState(true)
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [prizeIdToDelete, setPrizeIdToDelete] = useState(-1);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(document.cookie.length == 0){
            navigate("/")
        }
        GetGiveawaysPrizes();
    }, [])

    const api = new ApiCalls.ApiCalls();
    const GetGiveawaysPrizes = async () => {
        const tempPrizes = await api.GetGiveawaysPrizes(params.id);
        if(tempPrizes) {
            setPrizes(tempPrizes)
        }
    }

    const HideOrShowModal = (value) => {
        setIsModalHidden(value);
    }

    const HideConfirmModal = () => {
        setIsConfirmHide(true)
    }

    const ShowConfirmModal = (id) => {
        setPrizeIdToDelete(id);
        setIsConfirmHide(false)
    }

    const ConfirmDelete = async() => {
        const resDelete = await api.DeletePrize(prizeIdToDelete);
        if(resDelete != undefined){
            if(resDelete.error || resDelete.failed){
                setIsHide(false)
                setNotificationMessage(resDelete.failedMessage)
            }
            else if(resDelete.successed){
                setIsHide(false)
                setNotificationMessage("Prize successfully deleted.") 
                if(prizeIdToDelete > -1){
                    setPrizes(prizes.filter((prize) => prize.PrizeId != prizeIdToDelete));
                }
            }
            else{
                setIsHide(false)
                setNotificationMessage("Delete could not be performed...")                
            }
        }
        else{
            setIsHide(false)
            setNotificationMessage("Delete could not be performed...")
        }
    }
    return (
        <div className='tableList-container prizeList-container'>
            <EditNotification isHide ={isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <DeleteConfirmModal isConfirmHide={isConfirmHide} HideConfirmModal={HideConfirmModal} ConfirmDelete={ConfirmDelete}/>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Prize Image</th>
                        <th>Order of Winning</th>
                        <th>Count of Winners</th>
                    </tr>
                </thead>
            
                <tbody>
                {
                    prizes.map((prize,index) => {
                        return(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{prize.PrizeName}</td>
                                <td className='prizeList-prizeImg'><img src={prize.PrizeImage ? `http://localhost:3001/prize_image/${prize.PrizeImage}` : `http://localhost:3001/prize_image/highway.jpg`}/></td>
                                <td>{prize.OrderOfWinning}</td>
                                <td>{prize.CountOfWinners}</td>
                                <td className="td-button">
                                    <Link to={`/control/prizes/${prize.PrizeId}/edit`}>
                                        Edit
                                    </Link>
                                </td>
                                <td className="td-button" onClick={() => ShowConfirmModal(prize.PrizeId)}>
                                    Delete
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default GiveawaysPrizeList
