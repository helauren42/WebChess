import { SOCKET_ADDRESS } from './Const';
import "../CSS/Dialogs.css"
import { WS } from './App.js'

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
          <button className="invite-button invite-reject">reject</button>
          <button className="invite-button invite-accept" onClick={(e) => acceptInvitation()}>accept</button>
        </div>
      </div>
    </dialog >
  )
}
