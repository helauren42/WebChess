import "../CSS/Dialogs.css"

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

export const displayDialogGameInvitation = () => {
  const elem = document.getElementById("dialog-websocket-disconnection-error")
  elem.showModal()
}

export const DialogGameInvitation = ({ inviter }) => {
  return (
    <dialog className="dialog" id="dialog-websocket-disconnection-error">
      <div className="dialog-content">
        <h1>Connection Error</h1>
        <p>{inviter} has sent challenged you to a game</p>
        <div className="invite-response">
          <button className="invite-button invite-reject">reject</button>
          <button className="invite-button invite-accept">accept</button>
        </div>
      </div>
    </dialog >
  )
}
