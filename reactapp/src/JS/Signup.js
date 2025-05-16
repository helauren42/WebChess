import { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom'
import { SOCKET_ADDRESS } from "./Const";

export const SignupPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const inputChange = (e) => {
    return e.target.value
  }
  const checkPasswordMatch = (() => {
    if (password != confirmPassword) {
      setErrorMessage("Passwords do not match")
      return false
    }
    setErrorMessage("")
    return true
  })
  const submitSignup = async (e) => {
    e.preventDefault()
    console.log("submitting login: ", e)
    console.log(username)
    console.log(password)
    console.log(email)
    if (checkPasswordMatch() == false)
      return
    const endpoint = `${SOCKET_ADDRESS}/signup`
    const body = JSON.stringify({ username, password, email })
    const data = await fetch(endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body
      }
    ).then((resp) => {
      return resp.json()
    }).catch((error) => {
      setErrorMessage("Could not connect to server")
      console.log("Could not connect to server: ", error)
    })
    console.log(endpoint)
    console.log(data)
    setUsername("")
    setPassword("")
    setEmail("")
    e.target.reset()
  }
  const errorMessageDisplay = (() => {
    const elem = document.getElementById('signup-error-message')
    if (errorMessage == "")
      elem.style.display = "none"
    else
      elem.style.display = "block"
  }, [errorMessage])
  return (
    <div className="account-base-container">
      <div className="account-block">
        <h1 className='account-title'>Signup</h1>
        <form className="account-form" onSubmit={(e) => { submitSignup(e) }}>
          <div className='input-block'>
            <h2 className='input-header'>username</h2>
            <input className='input-input' required type="text" pattern="^[\w]+$" minLength={5} title="Username must be at least 5 characters long and can only container alphanumerical characters or underscore" onChange={(e) => setUsername(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>password</h2>
            {/* <input className='input-input' required type="password" min={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}" title="Password must have min 8 characters, a lowercase, an uppercase, a digit and a special character" onChange={(e) => setPassword(inputChange(e))} /> */}
            <input className='input-input' required type="text" pattern="^[\w]+$" minLength={5} title="Username must be at least 5 characters long and can only container alphanumerical characters or underscore" onChange={(e) => setPassword(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>confirm password</h2>
            {/* <input className='input-input' required type="password" min={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}" title="Password must have min 8 characters, a lowercase, an uppercase, a digit and a special character" onChange={(e) => setConfirmPassword(inputChange(e))} /> */}
            <input className='input-input' required type="text" pattern="^[\w]+$" minLength={5} title="Username must be at least 5 characters long and can only container alphanumerical characters or underscore" onChange={(e) => setConfirmPassword(inputChange(e))} />
          </div>
          <div className='input-block'>
            <h2 className='input-header'>email</h2>
            <input className='input-input' pattern="[a-z0-9._+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$" required type="email" onChange={(e) => setEmail(inputChange(e))} title="This is not a valid email address" />
          </div>
          <div className='centerx-container'>
            <button className='account-submit-btn'>submit</button>
          </div>
          <div className='centerx-container'>
            <p id="signup-error-message" className='account-error-message'>{errorMessage}</p>
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

