import { SOCKET_ADDRESS } from './Const';
import { useEffect } from 'react'
import "../CSS/Dialogs.css"
import { WS } from './App.js'

export const displayAlertBox = (title, content) => {
  const titleElem = document.getElementById("alert-box-title")
  titleElem.innerText = title
  const contentElem = document.getElementById("alert-box-content")
  contentElem.innerText = content
  const alertBox = document.getElementById("alert-box")
  alertBox.style.display = "flex"
  let opacity = 100
  const reduction = 0.7
  const sleep = 12
  setTimeout(() => {
    const intervalId = setInterval(() => {
      const opacityLevel = `${opacity}%`
      alertBox.style.opacity = opacityLevel
      opacity -= reduction
      if (opacity <= 0) {
        alertBox.style.opacity = "100%"
        alertBox.style.display = "none"
        clearInterval(intervalId)
      }
    }, sleep)
  }, 1000)
}

export const AlertBox = () => {
  useEffect(() => {
    displayAlertBox("Alert", "Something went wrong I guess")
  })
  return (
    <div id="alert-box">
      <h2 id="alert-box-title"></h2>
      <p id="alert-box-content"></p>
      <p className="ghost"></p>
    </div>
  )
}

export const displayDialogServerConnectionError = () => {
  const elem = document.getElementById("dialog-server-connection-error")
  elem.showModal()
}

export const DialogServerConnectionError = () => {
  return (
    <dialog className="dialog" id="dialog-server-connection-error">
      <div className="dialog-content">
        <h1>Connection Error</h1>
        <p>Failed to connect to server please refresh the page</p>
        <span className="ghost"></span>
      </div>
    </dialog>
  )
}

export const displayDialogWebsocketDisconnectionError = () => {
  const elem = document.getElementById("dialog-websocket-disconnection-error")
  elem.showModal()
}

export const DialogWebsocketDisconnectionError = () => {
  return (
    <dialog className="dialog" id="dialog-websocket-disconnection-error">
      <div className="dialog-content">
        <h1>Connection Error</h1>
        <p>You have been disconnected please refresh the page</p>
        <span className="ghost"></span>
      </div>
    </dialog>
  )
}

export const displayDialogGameInvitation = (challenger) => {
  const elem = document.getElementById("dialog-websocket-game-invitation")
  elem.showModal()
  const challenger_element = document.getElementById("challenger-text-name")
  challenger_element.innerText = `${challenger}`
}
export const hideDialogGameInvitation = (challenger) => {
  const elem = document.getElementById("dialog-websocket-game-invitation")
  elem.close()
}

export const DialogGameInvitation = ({ accountUsername }) => {
  const acceptInvitation = () => {
    const challenger = document.getElementById("challenger-text-name")
    WS.acceptChallenger(challenger.innerText, accountUsername)
  }
  return (
    <dialog className="dialog" id="dialog-websocket-game-invitation">
      <div className="dialog-content">
        <div>
          <h1 className="challenger-text">You have been challenged to a game by </h1>
          <h1 className="challenger-text" id="challenger-text-name"></h1>
          <h1 className="challenger-text">!</h1>
        </div>
        <p className="ghost"></p>
        <div className="invite-response">
          <button className="invite-button invite-reject" onClick={(e) => {
            hideDialogGameInvitation()
          }}>reject</button>
          <button className="invite-button invite-accept" onClick={(e) => {
            hideDialogGameInvitation()
            acceptInvitation()
          }}>accept</button>
        </div>
      </div>
    </dialog >
  )
}
