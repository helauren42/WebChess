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
import { WS } from './WebSocket.js'

export const AppContext = createContext()
export const AccountContext = createContext()

const COOKIE_SESSION = "chessSessionToken"
const COOKIE_PERSISTENT = "persistentToken"

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return parts.pop().split(';').shift();
  return null
}

const App = () => {
  const [signedIn, setSignedIn] = useState(getCookie("chessSessionToken") != null ? true : getCookie("persistentToken") != null ? true : false)
  const [websocket, setWebsocket] = useState(null)
  const [accountUsername, setAccountUsername] = useState("")
  const sessionToken = getCookie("chessSessionToken")
  const persistentToken = getCookie("persistentToken")
  console.log("session cookie: ", sessionToken)
  console.log("persistent cookie: ", persistentToken)
  console.log("signedin: ", signedIn)
  useEffect(() => {
    console.log('updated account username: ', accountUsername);
  }, [accountUsername]); // Runs whenever accountUsername changes
  const fetchUsername = async () => {
    console.log("fetching username")
    const token = sessionToken ? sessionToken : persistentToken
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
  useEffect(() => {
    if (signedIn == false) {
      document.cookie = `${COOKIE_SESSION}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${COOKIE_PERSISTENT}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    else {
      fetchUsername()
    }
  }, [signedIn])

  return (
    <AppContext.Provider value={[signedIn, setSignedIn, websocket, setWebsocket]}>
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
      </AccountContext.Provider>
    </AppContext.Provider >
  )
}

export default App;

