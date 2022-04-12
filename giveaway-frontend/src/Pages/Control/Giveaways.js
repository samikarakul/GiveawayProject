import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import NewGiveawayModal from '../../Components/Control/NewGiveawayModal';
import NewPrizeModalOpenButton from '../../Components/Control/NewPrizeModalOpenButton';
import DeleteConfirmModal from '../../Components/Control/DeleteConfirmModal';
import EditNotification from '../../Components/Control/EditNotification';
import '../../css/GiveawaysPage.css';
const ApiCalls = require('../../ApiCalls');
function Giveaways() {
    const [giveaways, setGiveaways] = useState([]);
    const [isModalHidden, setIsModalHidden] = useState(true);
    const [isConfirmHide, setIsConfirmHide] = useState(true)
    const [isHide, setIsHide] = useState(true);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [giveawayIdToDelete, setGiveawayIdToDelete] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        if(document.cookie.length == 0){
            navigate("/")
        }
        
        GetAllGiveaways();
        
    }, [])

    

    const api = new ApiCalls.ApiCalls();
    const GetAllGiveaways = async () => {
        const tempGiveaways = await api.GetAllGiveaways();
        if(tempGiveaways != undefined){
            setGiveaways(tempGiveaways);
        }
    }

    const FormatGiveaways = (tempGiveaways) => {
        const tmp = tempGiveaways;
        tmp.map((giveaway) =>  {
            giveaway.StartingDate = giveaway.StartingDate.split("T")[0].split("-").reverse().join("-");
            giveaway.EndingDate = giveaway.EndingDate.split("T")[0].split("-").reverse().join("-")
        });

        
        setGiveaways(tmp);
    }

    const HideOrShowModal = (value) => {
        setIsModalHidden(value);
    }

    const HideConfirmModal = () => {
        setIsConfirmHide(true)
    }

    const ShowConfirmModal = (id) => {
        setGiveawayIdToDelete(id);
        setIsConfirmHide(false)
    }

    const ConfirmDelete = async() => {
        const resDelete = await api.DeleteGiveaway(giveawayIdToDelete);
        if(resDelete != undefined){
            if(resDelete.error || resDelete.failed){
                setIsHide(false)
                setNotificationMessage(resDelete.failedMessage)
            }
            else if(resDelete.successed){
                setIsHide(false)
                setNotificationMessage("Giveaway successfully deleted.") 
                if(giveawayIdToDelete > -1){
                    setGiveaways(giveaways.filter((giveaway) => giveaway.GiveawayId != giveawayIdToDelete));
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
        <div className='giveawaysPage-container tableList-container'>
            <DeleteConfirmModal isConfirmHide={isConfirmHide} HideConfirmModal={HideConfirmModal} ConfirmDelete={ConfirmDelete}/>
            <EditNotification isHide = {isHide} notificationMessage={notificationMessage} setIsHide={setIsHide}/>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Sponsor</th>
                        <th>Starting Date</th>
                        <th>Ending Date</th>
                    </tr>
                </thead>
            
                <tbody>
                {
                    giveaways.map((giveaway,index) => {
                        return(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{giveaway.Title}</td>
                                <td>{giveaway.SponsorCompanyName}</td>
                                <td>{giveaway.StartingDate}</td>
                                <td>{giveaway.EndingDate}</td>
                                <td className="td-button">
                                    <Link to={`/control/giveaways/${giveaway.GiveawayId}/edit`}>
                                        Edit
                                    </Link>
                                </td>
                                <td className="td-button" onClick={() => ShowConfirmModal(giveaway.GiveawayId)}>
                                    Delete
                                </td>
                                <td className="td-button">
                                    <Link to={`/control/giveaways/${giveaway.GiveawayId}/participants`}>
                                        Show Participants
                                    </Link>
                                </td>
                                <td className="td-button">
                                    <Link to={`/control/giveaways/${giveaway.GiveawayId}/prizes`}>
                                        Show Prizes
                                    </Link>
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

export default Giveaways

