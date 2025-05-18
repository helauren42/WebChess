import { useEffect, useState, createContext, useContext } from "react";
import { Link } from 'react-router-dom'
import { SOCKET_ADDRESS } from "./Const";

export const SignupContext = createContext()

export const SignupForm = () => {
  const { username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    email, setEmail,
    errorMessage, setErrorMessage,
    signupProcess, inputChange
  } = useContext(SignupContext)
  return (
    <div className="account-block">
      <h1 className='account-title'>Signup</h1>
      <form className="account-form" onSubmit={(e) => { signupProcess(e) }}>
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
  )
}

const CodeValidationElement = ({ username, password, email, errorMessage, setErrorMessage }) => {
  const [code, setCode] = useState("")
  console.log("first email: ", email)
  const errorMessageDisplay = (() => {
    const elem = document.getElementById('signup-error-message')
    if (errorMessage == "")
      elem.style.display = "none"
    else
      elem.style.display = "block"
  }, [errorMessage])
  const validateCode = async (e) => {
    e.preventDefault()
    console.log("validating code")
    console.log("code: ", code)
    console.log("email: ", email)
    const body = JSON.stringify({ code, email })
    console.log("body of validate code: ", body)
    const resp = await fetch(`${SOCKET_ADDRESS}/validateCode`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body
      }
    ).then((resp) => {
      console.log("response received: ", resp.status)
      return resp
    }).catch((error) => {
      setErrorMessage("Could not connect to server")
      console.log("Could not connect to server: ", error)
      return null
    })
    if (resp == null)
      return
    const data = await resp.json()
    const msg = data["message"]
    console.log(data)
    console.log(msg)
    setErrorMessage(msg)
    if (resp.status != 200) {
      console.log("error: ", msg)
      return
    }
    await createAccount()
  }
  const createAccount = async () => {
    console.log("creating account")
    const body = JSON.stringify({ username, password, email })
    const resp = await fetch(`${SOCKET_ADDRESS}/createAccount`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body
      }
    ).then((resp) => {
      console.log("response received: ", resp.status)
      return resp
    }).catch((error) => {
      setErrorMessage("Account creation failed: Could not connect to server")
      console.log("Account Creation failed, could not connect to server: ", error)
      return null
    })
    const data = await resp.json()
    const msg = data["message"]
    console.log(data)
    console.log(msg)
    if (resp == null)
      return
    if (resp.status != 200) {
      setErrorMessage(msg)
      return
    }
    console.log("setting sessionToken cookie")
    document.cookie = `chessSessionToken=${data["sessionToken"]} path=/`
  }
  const updateCode = (e) => {
    setCode(e.target.value)
    console.log("post code: ", code)
  }
  return (
    <div className="code-validation-container">
      <form id="code-validation-form" onSubmit={(e) => validateCode(e, e.target.value)}>
        <div className='input-block'>
          <h2 className='input-header'>Code</h2>
          <input className='input-input' onChange={(e) => updateCode(e)} />
        </div>
        <div className='centerx-container'>
          <p id="signup-error-message" className='account-error-message'>{errorMessage}</p>
        </div>
        <div className='centerx-container'>
          <button className='account-submit-btn'>submit</button>
        </div>
      </form>
    </div>
  )
}

export const SignupPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  // elem is set to "form" or "code"
  const [elem, setElem] = useState("form")
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

  const sendVerificationEmail = async () => {
    const body = JSON.stringify({ username, email })
    const resp = await fetch(`${SOCKET_ADDRESS}/sendVerificationEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: body
    }).catch((error) => {
      setErrorMessage("Could not connect to server")
      console.log("Could not connect to server: ", error)
      return null
    })
    if (resp == null)
      return false
    if (resp.status != 200) {
      const data = await resp.json()
      console.log(data)
      setErrorMessage(data["message"])
      return false
    }
    console.log("sent verification email")
    return true
  }

  const validForm = async () => {
    const body = JSON.stringify({ username, password, email })
    let resp = await fetch(`${SOCKET_ADDRESS}/validateForm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: body
    }).catch((error) => {
      setErrorMessage("Could not connect to server")
      console.log("Could not connect to server: ", error)
      return null
    })
    if (resp == null)
      return false
    if (resp.status != 200) {
      const data = await resp.json()
      console.log(data)
      return false
    }
    console.log("input validated")
    return true
  }

  const signupProcess = async (e) => {
    e.preventDefault()
    e.target.reset()
    console.log("submitting signup: ", e)
    if (checkPasswordMatch() == false)
      return

    // validate the form make sure input is valid and non conflictual
    console.log("validating form")
    const validState = await validForm()
    if (validState == false)
      return
    // send verification email
    console.log("sending verification email")
    const verification_email_sent = await sendVerificationEmail()
    if (verification_email_sent == false) {
      setErrorMessage("Verification email failed to send")
      return
    }

    // verify email verification code entered is valid and then create account if valid in code validation form
    setElem("code")
  }
  const errorMessageDisplay = (() => {
    const elem = document.getElementById('signup-error-message')
    if (errorMessage == "")
      elem.style.display = "none"
    else
      elem.style.display = "block"
  }, [errorMessage])
  return (
    <SignupContext.Provider value={{
      username, setUsername,
      password, setPassword,
      confirmPassword, setConfirmPassword,
      email, setEmail,
      errorMessage, setErrorMessage,
      signupProcess, inputChange
    }}>
      <div className="account-base-container">
        {
          elem == "form" ?
            <SignupForm /> : <CodeValidationElement
              username={username}
              password={password}
              email={email}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
        }
      </div>
    </SignupContext.Provider >
  )
}

