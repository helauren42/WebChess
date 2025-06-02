import { useState, useEffect, createContext, useRef } from 'react';
import { Routes, Route } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'

import '../CSS/App.css'
import { HomePage } from "./Home.js"
import { NavBar } from './NavBar';
import { PlayPage } from './Game/Play.js'
import { OnlineGame } from './Game/Game.js';
import { LoginPage } from './Login.js'
import { SignupPage } from './Signup.js'
import { SocialPage } from './Social.js'
import { AccountPage } from './Account.js'
import { SOCKET_ADDRESS } from './Const';
import { WebSocketManager } from './WebSocket.js'
import { AlertBox, displayAlertBox, DialogServerConnectionError, DialogWebsocketDisconnectionError, DialogGameInvitation, displayDialogServerConnectionError } from './Dialogs';
import { GAME_MODE_HOTSEAT, GAME_MODE_ONLINE } from './Game/Game';

export const AppContext = createContext()
export const AccountContext = createContext()
export const SocialContext = createContext()
export const WS = new WebSocketManager()

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop().split(';').shift();
  return null
}

const App = () => {
  const [signedIn, setSignedIn] = useState(getCookie("sessionToken") != null ? true : getCookie("persistentToken") != null ? true : false)
  const [accountUsername, setAccountUsername] = useState("")
  const [globalChatHistory, setGlobalChatHistory] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [gameData, setGameData] = useState({})
  const navigate = useNavigate()
  const globalChatHistoryRef = useRef();
  globalChatHistoryRef.current = globalChatHistory;
  let sessionToken = getCookie("sessionToken")
  const persistentToken = getCookie("persistentToken")
  const createSessionTokenFromPersistentToken = async () => {
    sessionToken = crypto.randomUUID()
    document.cookie = `sessionToken=${sessionToken}; path=/; SameSite=None; Secure`;
    const resp = await fetch(`${SOCKET_ADDRESS}/addSessionToken`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ sessionToken, persistentToken })
    }).then((resp) => {
      return resp
    }).catch((e) => {
      displayDialogServerConnectionError()
      return null
    })
    if (!resp || resp.status != 200) {
      console.log("error adding session token: ", resp)
      displayDialogServerConnectionError()
    }
    console.log("added session token from persistent token")
  }
  const fetchUsername = async () => {
    console.log("fetching username")
    const token = sessionToken
    const body = JSON.stringify({ "token": token })
    const resp = await fetch(`${SOCKET_ADDRESS}/fetchUsername`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: body
    }).then((resp) => {
      return resp
    }).catch((e) => {
      console.log("could not fetch username from cookie: ", e)
      return null
    })
    if (resp != null && resp.status == 200) {
      const data = await resp.json()
      const username = data["username"]
      console.log("found username: ", username)
      setAccountUsername(username)
    }
    else
      setSignedIn(false)
  }
  // create sessionToken if persistentToken is found
  if (persistentToken && !sessionToken)
    createSessionTokenFromPersistentToken()
  useEffect(() => {
    if (signedIn == false) {
      document.cookie = `sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
    else {
      fetchUsername()
      WS.init(sessionToken, activeUsers, setActiveUsers, accountUsername, globalChatHistoryRef, setGlobalChatHistory, navigate, setGameData)
    }
  }, [signedIn])
  return (
    <AppContext.Provider value={[signedIn, setSignedIn]}>
      <SocialContext.Provider value={[activeUsers, setActiveUsers, globalChatHistory, setGlobalChatHistory]}>
        <AccountContext.Provider value={[accountUsername, setAccountUsername]}>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/play/online" element={<OnlineGame gameMode={GAME_MODE_ONLINE} gameData={gameData} />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
          <DialogServerConnectionError />
          <DialogWebsocketDisconnectionError />
          <DialogGameInvitation accountUsername={accountUsername} />
          <AlertBox />
        </AccountContext.Provider>
      </SocialContext.Provider>
    </AppContext.Provider >
  )
}

export default App;

