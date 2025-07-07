import { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import '../CSS/App.css'
import { HomePage } from "./Home.jsx"
import { NavBar } from './NavBar.jsx';
import { PlayPage } from './Game/Play.jsx'
import { OnlineGame } from './Game/Game.jsx';
import { LoginPage } from './Login.jsx'
import { SignupPage } from './Signup.jsx'
import { SocialPage } from './Social.jsx'
import { AccountPage } from './Account.jsx'
import { SOCKET_ADDRESS, WS } from './Const.jsx';
import { AlertBox, DialogServerConnectionError, DialogWebsocketDisconnectionError, DialogGameInvitation, displayDialogServerConnectionError } from './Dialogs.jsx';
import { GAME_MODE_HOTSEAT, GAME_MODE_ONLINE } from './Game/Game.jsx';
import { MatchMaking } from './MatchMaking';
import { PIECE_IMAGES } from './Game/Images';

export const AppContext = createContext()
export const AccountContext = createContext()
export const SocialContext = createContext()

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2)
		return parts.pop().split(';').shift();
	return null
}

const App = () => {
	console.log("start cookies: ", document.cookie)
	const [signedIn, setSignedIn] = useState(getCookie("sessionToken") != null ? true : getCookie("persistentToken") != null ? true : false)
	const [accountUsername, setAccountUsername] = useState("")
	const [globalChatHistory, setGlobalChatHistory] = useState([])
	const [activeUsers, setActiveUsers] = useState([])
	const [gameData, setGameData] = useState({})
	const [screenWidth, setScreenWidth] = useState(window.innerWidth)
	const [sessionToken, setSessionToken] = useState(getCookie("sessionToken"))
	const [persistentToken, setPersistentToken] = useState(getCookie("persistentToken"))
	const navigate = useNavigate()

	// preload images
	useEffect(() => {
		console.log("pre loading images")
		for (const key of Object.keys(PIECE_IMAGES)) {
			const img = new Image()
			img.src = PIECE_IMAGES[key]
		}
	}, [])
	useEffect(() => {
		console.log("changed sessiontToken: ", sessionToken)
	}, [sessionToken])
	useEffect(() => {
		console.log("changed persistentToken: ", persistentToken)
	}, [persistentToken])
	useEffect(() => {
		console.log("gameData: ", gameData)
	}, [gameData])
	useEffect(() => {
		const now = globalChatHistory
		WS.updateGlobalChat(now)
		console.log("global chat history use effect: ", now)
	}, [globalChatHistory])
	const createSessionTokenFromPersistentToken = async () => {
		// verify persistent token is still valid delete persistent token if no longer valid
		const validate = await fetch(`${SOCKET_ADDRESS}/validatePersistentToken?persistentToken=${persistentToken}`).then((resp) => {
			return resp
		}).catch((e) => {
			displayDialogServerConnectionError()
			return null
		})
		if (!validate || validate.status !== 200) {
			document.cookie = `persistentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
			console.log("persistent token no longer valid")
			return
		}
		// persistent token valid so let's set session token
		const createdToken = crypto.randomUUID()
		console.log("sessionToken created: ", createdToken)
		document.cookie = `sessionToken=${createdToken}; path=/;`;
		const resp = await fetch(`${SOCKET_ADDRESS}/addSessionToken`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify({ sessionToken: createdToken, persistentToken: persistentToken })
		}).then((resp) => {
			return resp
		}).catch((e) => {
			displayDialogServerConnectionError()
			return null
		})
		if (!resp || resp.status !== 200) {
			console.log("error adding session token: ", resp)
			displayDialogServerConnectionError()
			return
		}
		setSessionToken(createdToken)
		console.log("added session token from persistent token")
	}
	const fetchUsername = async () => {
		console.log("fetching username")
		const token = sessionToken
		const body = JSON.stringify({ "token": token })
		const resp = await fetch(`${SOCKET_ADDRESS}/fetchUsername`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: body
		}).then((resp) => {
			return resp
		}).catch((e) => {
			console.log("could not fetch username from cookie: ", e)
			console.log("token: ", token)
			return null
		})
		if (!resp) {
			console.log("Error response")
			return
		}
		const data = await resp.json()
		console.log("username req data: ", data)
		if (resp.status !== 200) {
			console.log("wrong username clearing cookies")
			document.cookie = `sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
			document.cookie = `persistentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
			setSignedIn(false)
		}
		else {
			const username = data["username"]
			console.log("found username: ", username)
			setAccountUsername(username)
			setSignedIn(true)
		}
	}
	// create sessionToken if persistentToken is found
	if (persistentToken && !sessionToken)
		createSessionTokenFromPersistentToken()
	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth)
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		if (sessionToken) {
			WS.init(sessionToken, setActiveUsers, globalChatHistory, setGlobalChatHistory, navigate, setGameData)
			fetchUsername()
		}
	}, [sessionToken])
	useEffect(() => {
		setSessionToken(getCookie("sessionToken"))
		setPersistentToken(getCookie("persistentToken"))
	}, [signedIn])
	return (
		<AppContext.Provider value={[signedIn, setSignedIn]}>
			<SocialContext.Provider value={[activeUsers, setActiveUsers, globalChatHistory, setGlobalChatHistory]}>
				<AccountContext.Provider value={[accountUsername, setAccountUsername]}>
					<section id="App">
						<NavBar screenWidth={screenWidth} />
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/play" element={<PlayPage gameData={gameData} />} />
							<Route path="/play/online" element={<OnlineGame accountUsername={accountUsername} gameMode={GAME_MODE_ONLINE} gameData={gameData} />} />
							<Route path="/play/matchmaking" element={<MatchMaking sessionToken={sessionToken} gameData={gameData} />} />
							<Route path="/social" element={<SocialPage screenWidth={screenWidth} />} />
							<Route path="/signup" element={<SignupPage />} />
							<Route path="/login" element={<LoginPage sessionToken={sessionToken} setSessionToken={setSessionToken} persistentToken={persistentToken} setPersistentToken={setPersistentToken} />} />
							<Route path="/account" element={<AccountPage />} />
						</Routes>
						<DialogServerConnectionError />
						<DialogWebsocketDisconnectionError />
						<DialogGameInvitation accountUsername={accountUsername} />
						<AlertBox />
					</section>
				</AccountContext.Provider>
			</SocialContext.Provider>
		</AppContext.Provider >
	)
}

export default App;

