import { useState, useEffect, useContext } from 'react';
import { AppContext, AccountContext } from "./App.jsx"
import { Link, useNavigate } from 'react-router-dom'
import '../CSS/Account.css'
import { SOCKET_ADDRESS } from './Const.jsx';

const makeSignoutRequest = () => {
	// todo
}

export const AccountPage = ({ sessionToken }) => {
	const [signedIn, setSignedIn] = useContext(AppContext)
	const [accountUsername, setAccountUsername] = useContext(AccountContext)
	const [userData, setUserData] = useState(null)

	const fetchUserData = async () => {
		const resp = await fetch(`${SOCKET_ADDRESS}/fetchUserData`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify({ "sessionToken": sessionToken })
		}).then((resp) => {
			return resp
		}).catch((e) => {
			return null
		})
		if (!resp || resp.status !== 200) {
			console.log("error fetching user data: ", resp)
			return
		}
		console.log("user data response: ", resp)
	}
	useEffect(() => {
		if (!signedIn)
			return
		fetchUserData()
	}, [signedIn])
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
