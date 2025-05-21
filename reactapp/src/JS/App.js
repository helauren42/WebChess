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

export const AppContext = createContext()

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
  const [accountUsername, setAccountUsername] = useState("")
  const sessionToken = getCookie("chessSessionToken")
  console.log("cookie: ", sessionToken)
  console.log("signedin: ", signedIn)
  const fetchUsername = async () => {
    console.log("fetching username")
    const body = JSON.stringify({ sessionToken })
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
      console.log("resp: ", resp)
      const data = await resp.json()
      setAccountUsername(data["username"])
    }
    else
      setSignedIn(false)
  }
  useEffect(() => {
    if (signedIn == false) {
      document.cookie = `${COOKIE_SESSION}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `chessSessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    else {
      fetchUsername()
    }
  }, [signedIn])

  return (
    <AppContext.Provider value={[signedIn, setSignedIn]}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App;

