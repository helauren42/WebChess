import { useState, useEffect, useContext } from 'react';
import { AppContext, AccountContext } from "./App.jsx"
import { Link, useNavigate } from 'react-router-dom'
import '../CSS/Account.css'
import { WS, SOCKET_ADDRESS } from './Const.jsx';

const makeSignoutRequest = async () => {
	try {
		await fetch(`${SOCKET_ADDRESS}/signout`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			credentials: 'include'
		});
	} catch (e) {
		console.error("Signout request failed: ", e);
	}
}

export const AccountPage = ({ sessionToken }) => {
	const [signedIn, setSignedIn] = useContext(AppContext)
	const [accountUsername, setAccountUsername] = useContext(AccountContext)
	const [userData, setUserData] = useState(null)
	const navigate = useNavigate()

	const fetchUserData = async () => {
		const body = JSON.stringify({ sessionToken })
		const resp = await fetch(`${SOCKET_ADDRESS}/fetchUserData`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: body
		}).then((resp) => {
			return resp
		}).catch((e) => {
			console.error("Error fetching user data: ", e)
			return null
		})
		if (!resp || resp.status !== 200) {
			console.log("Error fetching user data: ", resp)
			return
		}
		const data = await resp.json()
		console.log("User data response: ", data)
		setUserData(data["userData"])
	}

	useEffect(() => {
		if (!signedIn) {
			navigate("/login")
			return
		}
		fetchUserData()
	}, [signedIn, navigate])

	const handleSignout = async () => {
		setSignedIn(false)
		setAccountUsername("")
		document.cookie = `persistentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
		document.cookie = `sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
		navigate("/login")
		WS.logout()
	}

	return (
		<div id="account-page-container">
			{userData ? (
				<div className="profile-card navbar-pseudo">
					<h1 className="username">{userData.username}</h1>
					<p className="email">{userData.email}</p>
					<div className="stats-container">
						<div className="stat">
							<span className="stat-value">{userData.total_wins}</span>
							<span className="stat-label">Wins</span>
						</div>
						<div className="stat">
							<span className="stat-value">{userData.total_loss}</span>
							<span className="stat-label">Losses</span>
						</div>
						<div className="stat">
							<span className="stat-value">{userData.total_draws}</span>
							<span className="stat-label">Draws</span>
						</div>
					</div>
					<button className="classic-btn" onClick={handleSignout}>
						Log out
					</button>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	)
}
