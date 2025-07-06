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
			<h3 id="nav-title" className='subtitle'><Link to="/">Chess</Link></h3>
			<ul id="nav-links">
				<li><Link to="/"><h3 className='subtitle'>Home</h3></Link></li>
				<li><Link to="/play"><h3 className='subtitle'>Play</h3></Link></li>
				<li><Link to="/social"><h3 className='subtitle'>Social</h3></Link></li>
			</ul>
			<Link to={signedIn ? "/account" : "/login"}>{signedIn ? <p className='subtitle' >Account</p> : <p className='subtitle' >Login</p>}</Link>
		</div >
	)
}
