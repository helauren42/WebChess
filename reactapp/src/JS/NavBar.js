import { useState, useEffect, useContext } from 'react';
import { AppContext } from './App';
import '../CSS/NavBar.css'

export const NavBar = () => {
  const [signedIn, setSignedIn] = useContext(AppContext)
  return (
    <div id="navbar">
      <h1 id="nav-title">Chess</h1>
      <ul id="nav-links">
        <li>Home</li>
        <li>Play</li>
        <li>Menu</li>
      </ul>
      <button id="nav-login" onClick={() => setSignedIn(!signedIn)}>{signedIn ? 'account' : 'sign in'}</button>
    </div>
  )
}
