import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOCKET_ADDRESS } from './Const'
import { AppContext } from './App'
import '../CSS/Login.css'

export const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [signedIn, setSignedIn] = useContext(AppContext)
  const navigate = useNavigate()
  const inputChange = (e) => {
    return e.target.value
  }
  const errorMessageDisplay = (() => {
    const elem = document.getElementById('signup-error-message')
    if (errorMessage == "")
      elem.style.display = "none"
    else
      elem.style.display = "block"
  }, [errorMessage])
  const submitLogin = async (e) => {
    e.preventDefault()
    console.log("submitting login: ", e)
    console.log(username)
    console.log(password)
    const endpoint = `${SOCKET_ADDRESS}/login`
    const body = JSON.stringify({ 'username': username, 'password': password })
    console.log(body)
    const resp = await fetch(endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body
      }
    ).then((resp) => {
      return resp
    }).catch((e) => {
      setErrorMessage(e)
      return null
    })
    if (resp == null)
      return
    const data = await resp.json()
    setErrorMessage(data["message"])
    if (resp.status != 200)
      return
    console.log("setting sessionToken cookie")
    document.cookie = `chessSessionToken=${data["sessionToken"]}; path=/; SameSite=None; Secure`;
    navigate("/")
    setSignedIn(true)
    setUsername("")
    setPassword("")
    e.target.reset()
  }
  return (
    <div className="account-base-container">
      <div className="account-block">
        <h1 className='account-title'>Login</h1>
        <form className="account-form" onSubmit={(e) => { submitLogin(e) }}>
          <div className='input-block'>
            <h2 className='input-header'>username</h2>
            <input className='input-input' required type="text" onChange={(e) => setUsername(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>password</h2>
            <input className='input-input' required type="text" onChange={(e) => setPassword(inputChange(e))} />
          </div>
          <div className='centerx-container'>
            <button className='account-submit-btn'>submit</button>
          </div>
          <div className='centerx-container'>
            <p id="signup-error-message" className='account-error-message'>{errorMessage}</p>
          </div>
        </form>
        <Link to={"/signup"}>
          <div className='centerx-container'>
            <h3 className='account-signin-redirect'>Sign up instead</h3>
          </div>
        </Link>
      </div>
    </div >
  )
}
