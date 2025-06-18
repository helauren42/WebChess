import { useEffect, useContext, useState } from 'react'
import '../CSS/Social.css'
import { SocialContext, WS, AccountContext } from './App'
import { SOCKET_ADDRESS } from './Const'
import { displayDialogServerConnectionError, displayAlertBox } from './Dialogs'

const chatMessageContainer = (message, pos) => {
  const elem = document.createElement('div')
  elem.className = "chat-message-container"
  const paragraph = document.createElement('p')
  paragraph.className = "chat-message-paragraph"
  paragraph.innerText = message
  elem.append(paragraph)
  const wrapper = document.createElement('div')
  wrapper.className = "chat-message-container-wrapper"
  wrapper.classList.add(pos == "left" ? "left" : "right")
  wrapper.append(elem)
  const parent = document.getElementById("message-history")
  parent.append(wrapper)
  return elem
}

const createUserMessage = (message, sender, date) => {
  const elem = chatMessageContainer(message, "right")
  elem.id = "chat-message-user"
}
const createOtherMessage = (message, sender, date) => {
  const elem = chatMessageContainer(sender + ":\n" + message, "left")
  elem.id = "chat-message-other"
}

const createMessageBlock = (messageObject, accountUsername) => {
  const message = messageObject["message"]
  const sender = messageObject["sender"]
  const time = parseInt(messageObject["time"])
  const date = new Date(time)
  if (sender == accountUsername)
    createUserMessage(message, sender, date)
  else
    createOtherMessage(message, sender, date)
}

const getGlobalChatHistory = async () => {
  console.log("getGlobalChatHistory")
  const resp = await fetch(`${SOCKET_ADDRESS}/getGlobalChatHistory`, {
    headers: { "Content-type": "application/json" },
  }).then((resp) => {
    return resp
  }).catch((e) => {
    console.log("failed to fetch global chat history: ", e)
    return null
  })
  if (!resp || resp.status != 200) {
    displayDialogServerConnectionError()
    return null
  }
  if (resp == null)
    return []
  const data = await resp.json()
  const history = data["history"]
  console.log("history: ", history)
  return data["history"]
}

const sendChallenge = (challenger, challenged) => {
  console.log("sending challenge challenger: ", challenger, ", challenged: ", challenged)
  WS.sendChallenge(challenger, challenged)
  const elem = document.getElementById(`challenge-icon-${challenged}`)
  console.log("!!!!!!!! elem: ", elem)
  elem.textContent = '⏳'
  elem.onclick = () => {
    displayAlertBox("Patience", `Please wait, you have recently challenged ${challenged} to a game`)
  }
  setTimeout(() => {
    elem.textContent = '🆚';
    elem.onclick = (ev) => sendChallenge(challenger, challenged)
  }, 10000)
}
export const SocialPage = () => {
  const [activeUsers, setActiveUsers, globalChatHistory, setGlobalChatHistory] = useContext(SocialContext)
  const [globalInput, setGlobalInput] = useState("")
  const [accountUsername] = useContext(AccountContext)
  const [firstRender, setFirstRender] = useState(true)

  const createChatHistory = async (setGlobalChatHistory) => {
    console.log("createChatHistory")
    const history = await getGlobalChatHistory()
    setGlobalChatHistory(history)
  }
  const convertRemToPixels = (rem) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const appendBackground = async () => {
    const parent = document.getElementById("message-history")
    const blurr = document.createElement('div')
    blurr.id = "message-history-blurr"
    const parentRect = parent.getBoundingClientRect()
    const parentHeight = parentRect.height
    const parentWidth = parentRect.width
    const stickyBg = document.createElement('div')
    stickyBg.style.height = `${parentHeight - convertRemToPixels(0.2)}px`
    stickyBg.style.width = `${parentWidth - convertRemToPixels(0.2)}px`
    stickyBg.id = "history-sticky-background"
    parent.append(stickyBg)
    stickyBg.append(blurr)
    console.log("!!!!!!!!!APPENDED BACKGROUND")
    console.log(parentRect)
    console.log(parentRect.width)
    console.log(stickyBg.style.width)
  }
  useEffect(() => {
    if (!globalChatHistory || !accountUsername)
      return
    const parent = document.getElementById("message-history")
    const scrollToBottom = firstRender == true ? true : parent.clientHeight + parent.scrollTop + 5 >= parent.scrollHeight
    console.log("scrollToBottom: ", scrollToBottom)
    setFirstRender(false)
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild)
    }
    appendBackground()
    for (let i = globalChatHistory.length - 1; i >= 0; i--) {
      const block = globalChatHistory[i]
      const messageObject = { "message": block[3], "sender": block[2], "time": block[1] }
      createMessageBlock(messageObject, accountUsername)
    }
    if (scrollToBottom)
      parent.scrollTop = parent.scrollHeight
    console.log("!!!!: ", getComputedStyle(document.querySelector("#message-history")).overflowY)
  }, [globalChatHistory, accountUsername])
  useEffect(() => {
    createChatHistory(setGlobalChatHistory)
  }, [])
  useEffect(() => {
    const parent = document.getElementById("active-users-list")
    for (let i = 0; i < activeUsers.length; i++) {
      const username = activeUsers[i]
      const arrayUsersList = Array.from(document.getElementsByClassName("active-users-list-element"))
      for (let i = 0; i < arrayUsersList.length; i++) {
        const element = arrayUsersList[i]
        parent.removeChild(element)
      }
      for (let i = 0; i < activeUsers.length; i++) {
        const username = activeUsers[i]
        const container = document.createElement('div')
        container.className = "active-users-list-element navbar-pseudo"
        const middleElem = document.createElement('div')
        const leftElem = document.createElement('div')
        const rightElem = document.createElement('div')
        middleElem.className = "active-users-middle"
        leftElem.className = "active-users-left"
        rightElem.className = "active-users-right"
        // add username middle element
        const usernameElement = document.createElement('h3')
        usernameElement.title = username
        const textUsername = username.length < 15 ? username : username.substring(0, 14) + '.';
        // todo add profile picture to left element

        // right element icon
        usernameElement.textContent = username
        middleElem.append(usernameElement)
        const challengeIcon = document.createElement("span")
        challengeIcon.textContent = '🆚';
        challengeIcon.className = "challenge-icon"
        challengeIcon.id = `challenge - icon - ${username} `
        console.log("!!!!!!!!!! challengeIcon id: ", challengeIcon.id)
        challengeIcon.title = "challenge user"
        const messageIcon = document.createElement("span")
        messageIcon.textContent = '✉️';
        messageIcon.id = "message-icon"
        messageIcon.title = "message user"
        rightElem.append(challengeIcon)
        rightElem.append(messageIcon)
        challengeIcon.onclick = (ev) => sendChallenge(accountUsername, username)

        // append elements to parent
        container.append(leftElem)
        container.append(middleElem)
        container.append(rightElem)
        parent.append(container)
        console.log("updated active users")
      }
    }
  }, [activeUsers])
  const updateInput = (event) => {
    const input = event.target.value
    setGlobalInput(input)
  }
  const onSubmit = (event) => {
    if (globalInput == "")
      return
    const parent = document.getElementById("message-history")
    parent.scrollTop = parent.scrollHeight
    WS.sendGlobalChat(globalInput)
    setGlobalInput("")
    event.target.value = ""
  }
  return (
    <div id='social-page-container' >
      <div className="whole-width" id="global-message-container">
        <div id="ghost"></div>
        <section id="global-message-section">
          <h3 id="global-message-title" className='navbar-pseudo'>Global Chat</h3>
          <section id="message-history">
          </section>
          <input id="input-message" type="text" onInput={(e) => updateInput(e)} onKeyDown={(e) => {
            if (e.key == 'Enter') onSubmit(e)
          }
          }></input>
        </section>
        <section id='active-users-container' className="light-reflection">
          <div id="active-users-title-container" className="navbar-pseudo">
            <h1 id='active-users-title' >Active Users</h1>
          </div>
          <div id='active-users-list'></div>
        </section>
      </div >
    </div >
  )
}

