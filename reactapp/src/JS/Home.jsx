import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./App.jsx"
import '../CSS/Home.css'

const SigninSection = ({ navigate }) => {
	return (
		<section id="signin-section">
			<button className="home-btn" onClick={() => navigate("/login")} ><p>Sign in</p></button>
		</section>
	)
}

const PlayGame = ({ navigate }) => {
	return (
		<section id="playgame-section">
			<button className="home-btn" onClick={() => navigate("/play/matchmaking")}><p>Play now</p></button>
		</section>
	)
}

export const HomePage = () => {
	const [signedIn, setSignedIn] = useContext(AppContext)
	const navigate = useNavigate()
	return (
		<section id="home-page">
			<h1 id="home-title" >Welcome to the best online chess platform</h1>
			<h2 id="home-subtitle">Play against other top chess players and chat with them</h2>
			{signedIn ? <PlayGame navigate={navigate} /> : <SigninSection navigate={navigate} />}
		</section>
	)
}

