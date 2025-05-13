import { useState, useEffect, useContext, createContext } from 'react';
import { NavBar } from './NavBar';

import '../CSS/App.css'
import { HomePage } from "./HomePage.js"

export const AppContext = createContext()

const App = () => {
  const [signedIn, setSignedIn] = useState(false)
  return (
    <AppContext.Provider value={[signedIn, setSignedIn]}>
      <NavBar />
      <HomePage></HomePage>
    </AppContext.Provider>
  )
}

export default App;

