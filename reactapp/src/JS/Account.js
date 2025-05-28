import { useState, useEffect, useContext } from 'react';
import { AppContext, AccountContext } from "./App.js"
import { Link, useNavigate } from 'react-router-dom'
import '../CSS/Account.css'

const makeSignoutRequest = () => {
  // todo
}

export const AccountPage = () => {
  const [signedIn, setSignedIn] = useContext(AppContext)
  const [accountUsername, setAccountUsername] = useContext(AccountContext)
  return (
    <div id="account-page-container">
      <Link to={"/login"}>
        <h1>{accountUsername}</h1>
        <button onClick={() => {
          makeSignoutRequest()
          setSignedIn(false)
        }}>Log out </button>
      </Link>
    </div>
  )
}
