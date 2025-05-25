import { useState, useEffect, useContext, createContext } from 'react';
import { Routes, Route } from 'react-router-dom'

import '../CSS/App.css'
import { HomePage } from "./Home.js"
import { NavBar } from './NavBar';
import { GamePage } from './Game.js'
import { LoginPage } from './Login.js'
import { SignupPage } from './Signup.js'
import { SocialPage } from './Social.js'
import { AccountPage } from './Account.js'
import { SOCKET_ADDRESS } from './Const';
import { WebSocketManager } from './WebSocket.js'
import { DialogServerConnectionError, DialogWebsocketDisconnectionError, DialogGameInvitation, displayDialogServerConnectionError } from './Dialogs';

export const AppContext = createContext()
export const AccountContext = createContext()
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
  const [activeUsers, setActiveUsers] = useState([])
  let sessionToken = getCookie("sessionToken")
  const persistentToken = getCookie("persistentToken")
  const createSessionTokenFromPersistentToken = async () => {
    sessionToken = crypto.randomUUID()
    document.cookie = `sessionToken=${sessionToken}; path=/; SameSite=None; Secure`;
    const resp = await fetch(`${SOCKET_ADDRESS}/addSessionToken`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ sessionToken })
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
    console.log("token:", token)
    const body = JSON.stringify({ "token": token })
    console.log(body)
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
      console.log(data)
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
      document.cookie = `sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `persistentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    else {
      fetchUsername()
      WS.init(sessionToken, activeUsers, setActiveUsers)
    }
  }, [signedIn])

  console.log("session cookie: ", sessionToken)
  console.log("persistent cookie: ", persistentToken)
  console.log("signedin: ", signedIn)
  return (
    <AppContext.Provider value={[signedIn, setSignedIn, activeUsers, setActiveUsers]}>
      <AccountContext.Provider value={[accountUsername, setAccountUsername]}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
        <DialogServerConnectionError />
        <DialogWebsocketDisconnectionError />
        <DialogGameInvitation />
      </AccountContext.Provider>
    </AppContext.Provider >
  )
}

export default App;

