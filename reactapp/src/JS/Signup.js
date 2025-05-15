import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { SOCKET_ADDRESS } from "./Const";

export const SignupPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const inputChange = (e) => {
    return e.target.value
  }
  const submitSignup = async (e) => {
    e.preventDefault()
    console.log("submitting login: ", e)
    console.log(username)
    console.log(password)
    console.log(email)
    const endpoint = `${SOCKET_ADDRESS}/signup`
    const body = JSON.stringify({ username, password, email })
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
    setEmail("")
    e.target.reset()
  }
  return (
    <div className="account-base-container">
      <div className="account-block">
        <h1 className='account-title'>Signup</h1>
        <form className="account-form" onSubmit={(e) => { submitSignup(e) }}>
          <div className='input-block'>
            <h2 className='input-header'>username</h2>
            <input className='input-input' required type="text" onChange={(e) => setUsername(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>password</h2>
            <input className='input-input' required type="text" onChange={(e) => setPassword(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>email</h2>
            <input className='input-input' required type="text" onChange={(e) => setEmail(inputChange(e))} />
          </div>
          <div className='centerx-container'>
            <button className='account-submit-btn'>submit</button>
          </div>
        </form>
        <Link to={"/login"}>
          <div className='centerx-container'>
            <h3 className='account-signin-redirect'>login instead</h3>
          </div>
        </Link>
      </div>
    </div >
  )
}

