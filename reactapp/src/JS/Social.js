import { useEffect, useContext, useState } from 'react'
import '../CSS/Social.css'
import { SocialContext, WS, AccountContext } from './App'

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

export const SocialPage = () => {
  const [activeUsers, setActiveUsers, recvGlobalChatMsg, setRecvGlobalChatMsg] = useContext(SocialContext)
  const [globalInput, setGlobalInput] = useState("")
  const [accountUsername] = useContext(AccountContext)
  console.log("Social page active users: ", activeUsers)
  useEffect(() => {
    console.log("effect recv global message: ", recvGlobalChatMsg)
    if (recvGlobalChatMsg == null)
      return
    const message = recvGlobalChatMsg["message"]
    const sender = recvGlobalChatMsg["sender"]
    const time = parseInt(recvGlobalChatMsg["time"])
    const date = new Date(time)
    if (sender == accountUsername)
      createUserMessage(message, sender, date)
    else
      createOtherMessage(message, sender, date)
  }, [recvGlobalChatMsg])
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
        container.className = "active-users-list-element"
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
        // const messageIcon = document.createElement("span")
        // messageIcon.textContent = '✉️';
        // rightElem.append(messageIcon)

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
    console.log("global chat input: ", input)
    setGlobalInput(input)
  }
  const onSubmit = (event) => {
    if (globalInput == "")
      return
    WS.sendGlobalChat(globalInput)
    setGlobalInput("")
    event.target.value = ""
  }
  return (
    <div id='social-page-container' >
      <div className="whole-width" id="global-message-container">
        <div id="ghost"></div>
        <section id="global-message-section">
          <section id="message-history"></section>
          <input id="input-message" type="text" onInput={(e) => updateInput(e)} onKeyDown={(e) => {
            if (e.key == 'Enter') onSubmit(e)
          }
          }></input>
        </section>
        <section id='active-users-container'>
          <div id="active-users-title-container">
            <h1 id='active-users-title'>Active Users</h1>
          </div>
          <div id='active-users-list'></div>
        </section>
      </div >
    </div >
  )
}

