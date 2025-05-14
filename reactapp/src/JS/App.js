import { useState, useEffect, useContext, createContext } from 'react';
import { Routes, Route } from 'react-router-dom'

import '../CSS/App.css'
import { HomePage } from "./HomePage.js"
import { NavBar } from './NavBar';
import { GamePage } from './Game.js'
import { SigninPage } from './Signin.js'
import { SocialPage } from './Social.js'
import { AccountPage } from './Account.js'

export const AppContext = createContext()

const App = () => {
  const [signedIn, setSignedIn] = useState(false)
  return (
    <AppContext.Provider value={[signedIn, setSignedIn]}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App;

