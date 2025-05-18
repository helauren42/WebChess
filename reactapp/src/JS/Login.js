import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SOCKET_ADDRESS } from './Const'
import '../CSS/Login.css'

export const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const inputChange = (e) => {
    return e.target.value
  }
  const submitLogin = async (e) => {
    console.log("submitting login: ", e)
    console.log(username)
    console.log(password)
    const endpoint = `${SOCKET_ADDRESS}/login`
    const body = JSON.stringify({ 'username': username, 'password': password })
    const data = await fetch(endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body
      }
    )
    console.log(endpoint)
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
        </form>
        <Link to={"/signup/signupform"}>
          <div className='centerx-container'>
            <h3 className='account-signin-redirect'>Sign up instead</h3>
          </div>
        </Link>
      </div>
    </div >
  )
}
