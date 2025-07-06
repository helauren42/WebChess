import { useState, useEffect, useContext } from 'react';
import { AppContext, AccountContext } from "./App.jsx"
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
				<button className="classic-btn" onClick={() => {
					makeSignoutRequest()
					setSignedIn(false)
					document.cookie = `persistentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
					document.cookie = `sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
				}}>Log out</button>
			</Link>
		</div>
	)
}
