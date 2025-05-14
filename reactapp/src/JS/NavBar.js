import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import { AppContext } from './App';
import '../CSS/NavBar.css'

export const NavBar = () => {
  const [signedIn, setSignedIn] = useContext(AppContext)
  useEffect(() => {
  }, [signedIn])
  return (
    <div id="navbar">
      <h1 id="nav-title"><Link to="/">Chess</Link></h1>
      <ul id="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/game">Play</Link></li>
        <li><Link to="/social">Social</Link></li>
      </ul>
      <button ><Link id="nav-login" to="/signin">{signedIn ? 'account' : 'signin'}</Link></button>
    </div >
  )
}
