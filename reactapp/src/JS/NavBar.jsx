import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import { AppContext } from './App';
import { ReactComponent as KingSvg } from "../images/chess-king-svgrepo-com.svg"
import { ReactComponent as AccountSvg } from "../images/account-svgrepo-com.svg"
import '../CSS/NavBar.css'

const TABLET_WIDTH = 800
const MOBILE_WIDTH = 450

const TabletMenu = ({ setOpenMenu, openMenu }) => {
	return (
		<div id="classic-menu">
			<h3 className='subtitle std-hover' onClick={() => setOpenMenu(!openMenu)}>Menu</h3>
		</div>
	)
}

const ClassicMenu = () => {
	return (
		<div id="classic-menu">
			<ul id="nav-links">
				<li><Link to="/"><h3 className='subtitle std-hover'>Home</h3></Link></li>
				<li><Link to="/play"><h3 className='subtitle std-hover'>Play</h3></Link></li>
				<li><Link to="/social"><h3 className='subtitle std-hover'>Social</h3></Link></li>
			</ul>
		</div>
	)
}

const TextAccount = ({ signedIn }) => {
	return (
		<Link to={signedIn ? "/account" : "/login"}>{signedIn ? <p className='subtitle std-hover' >Account</p> : <p className='subtitle std-hover' >Login</p>}</Link>
	)
}

export const NavBar = ({ screenWidth }) => {
	const [signedIn, setSignedIn] = useContext(AppContext)
	const [openMenu, setOpenMenu] = useState(false)
	useEffect(() => {
	}, [signedIn])
	useEffect(() => {
		if (screenWidth > TABLET_WIDTH)
			setOpenMenu(false)
	}, [screenWidth])
	useEffect(() => {
		const nav_menu = document.getElementById("open-menu")
		if (openMenu)
			nav_menu.style.display = "block"
		else
			nav_menu.style.display = "none"
	}, [openMenu])
	return (
		<div id="navbar-wrapper">
			<div id="navbar">
				<div className='nav-fr'>
					{screenWidth > MOBILE_WIDTH ? <h3 id="nav-title" className='subtitle std-hover'><Link to="/">Chess</Link></h3> : <Link to="/"><KingSvg className='subtitle nav-svg-cont' /></Link>}
				</div>
				<div className='nav-fr'>
					{screenWidth > TABLET_WIDTH ? <ClassicMenu /> : <TabletMenu setOpenMenu={setOpenMenu} openMenu={openMenu} />}
				</div>
				<div className='nav-fr'>
					{screenWidth > MOBILE_WIDTH ? <TextAccount signedIn={signedIn} /> : <Link to={signedIn ? "/account" : "/login"}><AccountSvg className='subtitle nav-svg-cont' /></Link>}
				</div>
			</div >
			<div id="open-menu">
				<div id="open-menu-links">
					<Link to="/"><h3 className='subtitle std-hover'>Home</h3></Link>
					<Link to="/play"><h3 className='subtitle std-hover'>Play</h3></Link>
					<Link to="/social"><h3 className='subtitle std-hover'>Social</h3></Link>
				</div>
			</div>
		</div >
	)
}
