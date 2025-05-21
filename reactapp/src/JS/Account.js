import { useState, useEffect, useContext } from 'react';
import { AppContext } from "./App.js"
import { Link, useNavigate } from 'react-router-dom'

export const AccountPage = () => {
  const [signedIn, setSignedIn] = useContext(AppContext)
  return (
    <div>
      <Link to={"/login"}>
        <h1>Account Page</h1>
        <button onClick={() => {
          setSignedIn(false)
        }}>Log out </button>
      </Link>
    </div>
  )
}
