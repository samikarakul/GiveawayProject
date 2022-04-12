import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NewGiveawayModal from './Control/NewGiveawayModal';
import NewPrizeModal from './Control/NewPrizeModal';
import '../css/Navbar.css';

function Navbar({loginState, setLoginState}) {
  const location = useLocation()
  const navigate = useNavigate();
  let pathname = location.pathname.split("/");

  const [isModalHidden, setIsModalHidden] = useState(true);
  const [isPrizeModalHidden, setIsPrizeModalHidden] = useState(true);
  const [isPrizeListPage, setIsPrizeListPage] = useState(false);
  const [isGiveawayListPage, setIsGiveawayListPage] = useState(false);
  const [paramId, setParamId] = useState(-1);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [cookieState, setCookieState] = useState(document.cookie);

  useEffect(() => {
    if(loginState.length > 0){
      setIsUserLoggedIn(true)
    }
  }, [])


  const HideOrShowModal = (value) => {
    setIsModalHidden(value);
  }
  const HideOrShowPrizeModal = (value) => {
    setIsPrizeModalHidden(value);
  }


  const IsPrizePage = () => {
    if(pathname.length == 5){
      const forthValue = pathname[3];
      pathname.splice(3,1);
      if(forthValue != undefined && pathname.join('') == "controlgiveawaysprizes"){
        if(!isPrizeListPage){
          setParamId(forthValue);
          setIsPrizeListPage(true);
          setIsGiveawayListPage(false);
        }
        return true;
      }
    }
    return false;

  }
  
  const IsGiveawayPage = () => {
    if(pathname.join('') == "controlgiveaways"){
      if(!isGiveawayListPage){
        setIsGiveawayListPage(true);
        setIsPrizeListPage(false);
        return true;
      }
      return true;
    }
    else return false;
  }


  const CheckPage = () => {
    if(!IsGiveawayPage() && !IsPrizePage()){
      if(isGiveawayListPage) setIsGiveawayListPage(false);
      if(isPrizeListPage) setIsPrizeListPage(false);      
    }
  }

  CheckPage();

  return(
    <div className='navbar-container'>
        {
          isGiveawayListPage ? (<NewGiveawayModal isModalHidden={isModalHidden} HideOrShowModal={HideOrShowModal}/>) : ("")          
        } 
        {
          isPrizeListPage ? (<NewPrizeModal isPrizeModalHidden={isPrizeModalHidden} HideOrShowPrizeModal={HideOrShowPrizeModal} giveawayId={paramId}/>) : ("")
        }

        
        <ul>
            <li className='navbar-home'>
              <Link to={`/`}>
                Home
              </Link>
              </li>
            {

              loginState.length > 0 ||  document.cookie.length > 0 ? (<li className='navbar-control'>
                                                  <Link to={`/control/giveaways`}>
                                                      Giveaways
                                                  </Link>
                                                </li>): ("")
            }
            
            {
              isGiveawayListPage ? (<li className='navbar-control' onClick={() => HideOrShowModal(false)}>New Giveaway</li>) : ("")          
            }
            
            {
              isPrizeListPage ? (<li className='navbar-control' onClick={() => HideOrShowPrizeModal(false)}>New Prize</li>) : ("")
            }
            {
              isPrizeListPage ? (<li className='navbar-control'>
                                                    <Link to={`/control/giveaways/${location.pathname.split("/")[3]}/prizes/sort-prizes`}>
                                                      Change Prize Order
                                                    </Link>
                                                  </li>) : ("")
            } 
            {

            loginState.length > 0 ||  document.cookie.length > 0 ?(  
                                          <li className='navbar-control-right' onClick={() => {
                                            document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
                                            setLoginState("");
                                            navigate('/');
                                          }}
                                      >
                                            Logout
                                      </li>
                                          ):
                                          (
                                            <li className='navbar-control-right'>
                                              <Link to={`/login`}>
                                                  Login
                                              </Link>
                                            </li>
                                            
                                          )
            }
            
        </ul>
    </div>
  );
}

export default Navbar;
