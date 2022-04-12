import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { useState,useEffect } from "react";
import './App.css';
import ControlHome from "./Pages/Control/ControlHome";
import Home from './Pages/Home';
import RegisterPage from './Pages/RegisterPage';
import Participants from "./Pages/Control/Participants";
import NotFound from "./Pages/NotFound";
import Giveaways from "./Pages/Control/Giveaways";
import GiveawayEdit from "./Pages/Control/GiveawayEdit";
import GiveawaysParticipantList from "./Pages/Control/GiveawaysParticipantList";
import GiveawaysPrizeList from "./Pages/Control/GiveawaysPrizeList";
import PrizeEdit from "./Pages/Control/PrizeEdit";
import GiveawayDetails from "./Pages/GiveawayDetails";
import PrizeOrderSortPage from "./Pages/Control/PrizeOrderSortPage";
import Navbar from "./Components/Navbar";
function App() {
  const [loginState, setLoginState] = useState("");


  return (
    <div className="App">
      <div>
        <Router>
          <Navbar loginState={loginState} setLoginState={setLoginState}/>
          <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path="/giveaways/:id" exact element={<GiveawayDetails/>}/>
            <Route path="/register/:id" exact element={<RegisterPage/>}/>
            <Route path="/participants" exact element={<Participants/>}/>
            <Route path="/login" exact element={<ControlHome loginState={loginState} setLoginState={setLoginState}/>}/>
            <Route path="/control/giveaways" exact element={<Giveaways/>}/>
            <Route path="/control/giveaways/:id/edit" exact element={<GiveawayEdit/>}/>
            <Route path="/control/giveaways/:id/participants" exact element={<GiveawaysParticipantList/>}/>
            <Route path="/control/giveaways/:id/prizes" exact element={<GiveawaysPrizeList/>}/>
            <Route path="/control/prizes/:id/edit" exact element={<PrizeEdit/>}/>
            <Route path="/control/giveaways/:id/prizes/sort-prizes" exact element={<PrizeOrderSortPage/>}/>
            <Route path="/control/404" exact element={<NotFound/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
